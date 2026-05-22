"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BackgroundTexture;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const theme_1 = require("@/constants/theme");
function BackgroundTexture() {
    const Colors = (0, theme_1.useColors)();
    return (<react_native_1.View style={[react_native_1.StyleSheet.absoluteFill, styles.container, { backgroundColor: Colors.background }]}/>);
}
const styles = react_native_1.StyleSheet.create({
    container: {
        zIndex: -10,
    },
});
