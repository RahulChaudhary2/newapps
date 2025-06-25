import { Themes } from "@/constants/ColorsTheme";
import { useColorScheme } from "nativewind";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Themes.light & keyof typeof Themes.dark
) {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Themes[theme][colorName];
  }
}