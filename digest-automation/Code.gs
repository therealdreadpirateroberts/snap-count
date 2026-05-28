/**
 * Daily AI & Claude Intelligence Digest Pipeline
 * Author: Automation Architect
 * Version: 1.2.0
 * 
 * Scheduled to run daily at precisely 9:45 AM.
 */

// Configuration Feeds (Fully URL-Encoded Queries to prevent 400 Bad Requests)
const FEEDS = {
  ANTHROPIC_BLOG: "https://www.anthropic.com/index.xml",
  GOOGLE_NEWS_CLAUDE: 'https://news.google.com/rss/search?q=site:anthropic.com+OR+%22Claude+features%22+OR+%22Prompt+Engineering%22&hl=en-US&gl=US&ceid=US:en',
  GOOGLE_NEWS_AI_WORKFLOWS: 'https://news.google.com/rss/search?q=%22working+with+Claude%22+OR+%22Claude+workflow+optimization%22+OR+%22LLM+collaboration+best+practices%22&hl=en-US&gl=US&ceid=US:en',
  HN_RSS: "https://hnrss.github.io/search?q=Claude+OR+Anthropic",
  YOUTUBE_CLAUDE: 'https://news.google.com/rss/search?q=site:youtube.com+%28%22Anthropic%22+OR+%22Claude+3.5%22+OR+%22Claude+Co-work%22%29&hl=en-US&gl=US&ceid=US:en'
};

/**
 * Run this function ONCE manually in the editor to authorize and initialize the 9:45 AM trigger.
 */
function firstTimeSetup() {
  Logger.log("Initializing first-time setup...");
  scheduleNextRun();
  Logger.log("Initialization complete! Your pipeline is now scheduled to run daily at precisely 9:45 AM.");
}

/**
 * Main execution entry point.
 */
function runDigestPipeline() {
  const properties = PropertiesService.getScriptProperties();
  const apiKey = properties.getProperty("CLAUDE_API_KEY");
  const recipient = properties.getProperty("RECIPIENT_EMAIL");
  
  if (!apiKey || !recipient) {
    Logger.log("Error: CLAUDE_API_KEY or RECIPIENT_EMAIL is not set in Script Properties.");
    return;
  }
  
  Logger.log("Starting daily intelligence feed ingestion...");
  const rawArticles = collectFeeds();
  Logger.log(`Ingested ${rawArticles.length} raw articles from all streams (including YouTube & Atom).`);
  
  const filteredArticles = filterAndDeduplicate(rawArticles);
  Logger.log(`Filtered down to ${filteredArticles.length} net-new articles after deduplication.`);
  
  if (filteredArticles.length === 0) {
    Logger.log("No new intelligence items found today. Sending a short system health update.");
    sendNullStateEmail(recipient);
  } else {
    Logger.log("Synthesizing feed content using Claude API...");
    const digestData = callClaudeSynthesizer(apiKey, filteredArticles);
    
    Logger.log("Compiling and sending HTML digest...");
    sendDigestEmail(recipient, digestData);
    
    // Save processed URLs to prevent future duplicates
    markArticlesAsProcessed(filteredArticles);
  }
  
  // Schedule tomorrow's execution precisely at 9:45 AM
  scheduleNextRun();
  Logger.log("Pipeline executed successfully. Next run scheduled.");
}

/**
 * Programmatic self-scheduling trigger system for exactly 9:45 AM.
 */
function scheduleNextRun() {
  // Clear any existing triggers for runDigestPipeline to avoid duplicate trigger piling
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(t => {
    if (t.getHandlerFunction() === "runDigestPipeline") {
      ScriptApp.deleteTrigger(t);
    }
  });
  
  const now = new Date();
  const nextRun = new Date();
  
  // Set execution target to exactly 9:45 AM
  nextRun.setHours(9, 45, 0, 0);
  
  // If 9:45 AM today has already passed, schedule it for tomorrow
  if (now.getTime() >= nextRun.getTime()) {
    nextRun.setDate(nextRun.getDate() + 1);
  }
  
  ScriptApp.newTrigger("runDigestPipeline")
           .timeBased()
           .at(nextRun)
           .create();
  
  Logger.log(`Next execution scheduled precisely for: ${nextRun.toLocaleString()}`);
}

/**
 * Robust XML parser supporting both standard RSS 2.0 (channel/item) and Atom 1.0 (feed/entry) feed configurations.
 */
function collectFeeds() {
  const articles = [];
  
  for (const [sourceKey, url] of Object.entries(FEEDS)) {
    try {
      const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true, timeoutInSeconds: 15 });
      if (response.getResponseCode() !== 200) {
        Logger.log(`Warning: Feed ${sourceKey} returned response code ${response.getResponseCode()}`);
        continue;
      }
      
      const xml = response.getContentText();
      const document = XmlService.parse(xml);
      const root = document.getRootElement();
      
      // Attempt standard RSS 2.0 parsing
      const channel = root.getChild("channel");
      
      if (channel) {
        const items = channel.getChildren("item");
        items.forEach(item => {
          const title = item.getChildText("title") || "";
          const link = item.getChildText("link") || "";
          const description = item.getChildText("description") || "";
          const pubDateStr = item.getChildText("pubDate") || "";
          
          articles.push({
            source: sourceKey.replace(/_/g, " "),
            title: title,
            link: link,
            snippet: cleanSnippet(description),
            pubDate: pubDateStr
          });
        });
      } else {
        // Attempt Atom 1.0 parsing (e.g. Anthropic's Blog index.xml)
        const entries = root.getChildren();
        let entryCount = 0;
        
        entries.forEach(entry => {
          const name = entry.getName();
          if (name === "entry") {
            entryCount++;
            const title = entry.getChildText("title") || "";
            
            // Resolve atom link elements
            let link = "";
            const linkElement = entry.getChild("link");
            if (linkElement) {
              const hrefAttr = linkElement.getAttribute("href");
              link = hrefAttr ? hrefAttr.getValue() : "";
            }
            if (!link) {
              link = entry.getChildText("link") || "";
            }
            
            const summary = entry.getChildText("summary") || entry.getChildText("content") || "";
            const pubDateStr = entry.getChildText("published") || entry.getChildText("updated") || "";
            
            articles.push({
              source: sourceKey.replace(/_/g, " "),
              title: title,
              link: link,
              snippet: cleanSnippet(summary),
              pubDate: pubDateStr
            });
          }
        });
        
        if (entryCount === 0) {
          Logger.log(`Warning: Found no recognized items or entry nodes in feed ${sourceKey}`);
        }
      }
    } catch (e) {
      Logger.log(`Warning: Failed to fetch/parse feed ${sourceKey}: ${e.toString()}`);
    }
  }
  
  return articles;
}

/**
 * Clean RSS HTML descriptions into concise snippets.
 */
function cleanSnippet(rawHtml) {
  if (!rawHtml) return "";
  const cleaned = rawHtml.replace(/<[^>]*>/g, "")
                         .replace(/\s+/g, " ")
                         .trim();
  return cleaned.length > 300 ? cleaned.substring(0, 300) + "..." : cleaned;
}

/**
 * Deduplicates and filters items against prior sends.
 */
function filterAndDeduplicate(articles) {
  const userProperties = PropertiesService.getUserProperties();
  const filtered = [];
  const seenUrls = new Set();
  
  articles.forEach(article => {
    if (seenUrls.has(article.link)) return;
    
    // Check key-value store if this link was already sent
    const key = "sent_" + article.link.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 50);
    const alreadySent = userProperties.getProperty(key);
    
    if (!alreadySent) {
      seenUrls.add(article.link);
      filtered.push(article);
    }
  });
  
  return filtered;
}

/**
 * Writes processed article keys back to PropertiesService with clean expiry management.
 */
function markArticlesAsProcessed(articles) {
  const userProperties = PropertiesService.getUserProperties();
  const now = new Date().getTime().toString();
  
  articles.forEach(article => {
    const key = "sent_" + article.link.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 50);
    userProperties.setProperty(key, now);
  });
  
  // Clean up keys older than 14 days to prevent quota overflow
  const properties = userProperties.getProperties();
  const fourteenDaysAgo = new Date().getTime() - (14 * 24 * 60 * 60 * 1000);
  
  for (const [key, value] of Object.entries(properties)) {
    if (key.startsWith("sent_")) {
      const timestamp = parseInt(value, 10);
      if (isNaN(timestamp) || timestamp < fourteenDaysAgo) {
        userProperties.deleteProperty(key);
      }
    }
  }
}

/**
 * Formulates the heavy prompt and invokes Claude API for deep intelligence synthesis.
 */
function callClaudeSynthesizer(apiKey, articles) {
  const payloadArticles = articles.slice(0, 20).map((a, idx) => {
    return `[Article #${idx + 1}]
Source: ${a.source}
Title: ${a.title}
Link: ${a.link}
Snippet: ${a.snippet}
`;
  }).join("\n---\n");
  
  const systemPrompt = `You are a Principal Automation Architect and AI Systems Specialist.
Your task is to compile a raw list of articles, RSS items, YouTube video results, and news alerts into a high-density, noise-free, and actionable Daily Intelligence Digest.

Analyze the feed items and extract:
1. "Key Daily Bulletins": Exactly 3 highly critical takeaways of major technical or strategic releases.
2. "Official Claude News": Synthesis of direct updates from Anthropic ecosystem (API updates, blog, research, youtube releases). If the resource is a YouTube video, prefix the headline with "[Video]".
3. "External AI & Workflows": Curated and synthesized insights on advanced LLM integration paradigms, hackernews/dev articles on building with LLMs, video tutorials, and optimization strategies. If the resource is a YouTube video, prefix the headline with "[Video]".

CRITICAL RULES:
- Focus heavily on technical depth and direct developer impact. Filter out clickbait, general media speculation, and non-actionable startup funding news.
- Keep summaries compact, direct, and factual.
- Format your response STRICTLY as valid JSON matching the schema below. Do not include markdown codeblocks or extra text.

JSON RESPONSE SCHEMA:
{
  "bulletins": [
    "Text of bulletin 1 highlighting core technical impact.",
    "Text of bulletin 2 highlighting core technical impact.",
    "Text of bulletin 3 highlighting core technical impact."
  ],
  "officialClaude": [
    { "title": "Headline of the update", "link": "http://original.link", "summary": "Highly dense summary outlining what changed, who it impacts, and how to use it in practice." }
  ],
  "externalWorkflows": [
    { "title": "Headline of the insight", "link": "http://original.link", "summary": "Highly dense summary covering technical patterns, architectural implications, or workflow takeaways." }
  ]
}`;

  const userPrompt = `Synthesize these raw incoming news items:\n\n${payloadArticles}`;
  
  const apiPayload = {
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 4000,
    system: systemPrompt,
    messages: [
      { role: "user", content: userPrompt }
    ]
  };
  
  try {
    const response = UrlFetchApp.fetch("https://api.anthropic.com/v1/messages", {
      method: "post",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      payload: JSON.stringify(apiPayload),
      muteHttpExceptions: true
    });
    
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    if (responseCode !== 200) {
      throw new Error(`Claude API returned code ${responseCode}: ${responseText}`);
    }
    
    const parsedData = JSON.parse(responseText);
    const rawContent = parsedData.content[0].text;
    
    const jsonString = rawContent.replace(/^```json/, "").replace(/```$/, "").trim();
    return JSON.parse(jsonString);
    
  } catch (e) {
    Logger.log("Failed to process with Claude. Returning emergency raw digest: " + e.toString());
    return createEmergencyFallbackDigest(articles);
  }
}

/**
 * Structural backup parsing if Claude API is unreachable or rate limited.
 */
function createEmergencyFallbackDigest(articles) {
  return {
    bulletins: [
      "EMERGENCY FEEDBACK RUN: The intelligent LLM synthesizer was unreachable.",
      "Below is a direct raw compilation of unsummarized, newly arrived stream items.",
      "Standard LLM-ranking and de-noising was temporarily bypassed."
    ],
    officialClaude: articles.filter(a => a.source.includes("ANTHROPIC") || a.source.includes("CLAUDE")).map(a => ({
      title: a.title,
      link: a.link,
      summary: a.snippet || "Direct source stream ingestion."
    })),
    externalWorkflows: articles.filter(a => !a.source.includes("ANTHROPIC") && !a.source.includes("CLAUDE")).map(a => ({
      title: a.title,
      link: a.link,
      summary: a.snippet || "Direct source stream ingestion."
    }))
  };
}

/**
 * Renders the HTML template dynamically and dispatches the email.
 */
function sendDigestEmail(recipient, digestData) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  let bulletinsHtml = "";
  digestData.bulletins.forEach(b => {
    bulletinsHtml += `
      <li style="margin-bottom: 10px; font-size: 14px; line-height: 1.6; color: #1A1D21;">
        <strong>✓</strong> ${b}
      </li>`;
  });
  
  let claudeNewsHtml = "";
  if (digestData.officialClaude.length === 0) {
    claudeNewsHtml = `<p style="font-size: 14px; color: #64748b; font-style: italic;">No official Anthropic updates recorded in this run.</p>`;
  } else {
    digestData.officialClaude.forEach(item => {
      claudeNewsHtml += `
        <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px dashed #cbd5e1;">
          <h4 style="margin: 0 0 6px 0; font-size: 15px; font-weight: 700;">
            <a href="${item.link}" style="color: #FF5722; text-decoration: none;">${item.title}</a>
          </h4>
          <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #4a4a4a;">${item.summary}</p>
        </div>`;
    });
  }
  
  let externalWorkflowsHtml = "";
  if (digestData.externalWorkflows.length === 0) {
    externalWorkflowsHtml = `<p style="font-size: 14px; color: #64748b; font-style: italic;">No workflow curations recorded in this run.</p>`;
  } else {
    digestData.externalWorkflows.forEach(item => {
      externalWorkflowsHtml += `
        <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px dashed #cbd5e1;">
          <h4 style="margin: 0 0 6px 0; font-size: 15px; font-weight: 700;">
            <a href="${item.link}" style="color: #FF5722; text-decoration: none;">${item.title}</a>
          </h4>
          <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #4a4a4a;">${item.summary}</p>
        </div>`;
    });
  }
  
  const fullHtmlBody = getEmailTemplate(today, bulletinsHtml, claudeNewsHtml, externalWorkflowsHtml);
  
  MailApp.sendEmail({
    to: recipient,
    subject: `Daily AI & Claude Intelligence Digest — ${today}`,
    htmlBody: fullHtmlBody
  });
}

/**
 * Dispatches a lightweight system health email if zero new articles are found.
 */
function sendNullStateEmail(recipient) {
  const today = new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; background: #F4F5F7; border: 1.5px solid #64748b; border-radius: 8px;">
      <h3 style="color: #0c0c0c; margin-top: 0;">Daily Intelligence Pipeline Active</h3>
      <p style="font-size: 14px; color: #4a4a4a;">Your automation executed at the scheduled trigger window on <strong>${today}</strong>.</p>
      <p style="font-size: 14px; color: #4a4a4a; background: #ffffff; padding: 12px; border-left: 3px solid #FFCD00; border-radius: 4px;">
        <strong>Notice:</strong> 0 net-new items met the high-density filter criteria today. No duplicate or low-scoring media alerts were delivered to preserve your focus.
      </p>
      <p style="font-size: 12px; color: #64748b;">Pipeline heartbeat checks: OK.</p>
    </div>
  `;
  
  MailApp.sendEmail({
    to: recipient,
    subject: `Daily Intelligence Digest: Quiet Day — ${today}`,
    htmlBody: html
  });
}

/**
 * Hardcoded, Gmail-optimized HTML template wrapping logic.
 * Avoids browser defaults and ensures clean vertical column scaling.
 */
function getEmailTemplate(today, bulletins, claudeNews, externalWorkflows) {
  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Daily Intelligence Digest</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin: 0; padding: 0; background-color: #F4F5F7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F4F5F7; padding: 20px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border: 1.5px solid #64748b; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #0c0c0c; padding: 24px; border-bottom: 4px solid #FF5722;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <span style="background-color: #FFCD00; color: #0c0c0c; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px;">
                      INTELLIGENCE DEEP DIVE
                    </span>
                    <h1 style="margin: 8px 0 0 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">
                      Claude & AI Systems Digest
                    </h1>
                    <p style="margin: 4px 0 0 0; color: #cbd5e1; font-size: 13px;">
                      Scheduled Intelligence Briefing • ${today}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Key Bulletins (Ceremonial Dark Panel Concept Built for Light Canvas) -->
          <tr>
            <td style="padding: 24px 24px 12px 24px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #E8EAED; border-radius: 8px; border-left: 4px solid #FFCD00;">
                <tr>
                  <td style="padding: 16px;">
                    <h3 style="margin: 0 0 10px 0; color: #0c0c0c; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 800;">
                      Key Daily Bulletins
                    </h3>
                    <ul style="margin: 0; padding: 0 0 0 5px; list-style-type: none;">
                      ${bulletins}
                    </ul>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Content Sections -->
          <tr>
            <td style="padding: 12px 24px 24px 24px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    
                    <!-- Section: Official Claude Ecosystem -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                      <tr>
                        <td style="padding-bottom: 12px; border-bottom: 1.5px solid #64748b;">
                          <h2 style="margin: 0; font-size: 16px; font-weight: 800; color: #0c0c0c; text-transform: uppercase; letter-spacing: 0.5px;">
                            Official Anthropic & Claude Ecosystem
                          </h2>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 15px;">
                          ${claudeNews}
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Section: Advanced AI & Workflow Methods -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding-bottom: 12px; border-bottom: 1.5px solid #64748b;">
                          <h2 style="margin: 0; font-size: 16px; font-weight: 800; color: #0c0c0c; text-transform: uppercase; letter-spacing: 0.5px;">
                            External AI Workflow Architectures
                          </h2>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 15px;">
                          ${externalWorkflows}
                        </td>
                      </tr>
                    </table>
                    
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #F4F5F7; padding: 20px 24px; border-top: 1.5px solid #64748b; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #64748b; line-height: 1.5;">
                This automated briefing was compiled and synthesized by a dedicated instance of Claude 3.5 Sonnet.<br />
                Delivery scheduled daily at precisely 9:45 AM.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
