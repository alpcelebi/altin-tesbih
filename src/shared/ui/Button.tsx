import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Text } from './Text';
import { useTheme } from '../../core/hooks';
import { hapticService } from '../../core/services';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon,
    style,
    textStyle,
}) => {
    const theme = useTheme();

    const handlePress = () => {
        if (!disabled && !loading) {
            hapticService.selection();
            onPress();
        }
    };

    const getBackgroundColor = () => {
        if (disabled) return theme.colors.border;
        switch (variant) {
            case 'primary': return theme.colors.primary;
            case 'secondary': return theme.colors.secondary;
            case 'outline': return 'transparent';
            case 'ghost': return 'transparent';
            default: return theme.colors.primary;
        }
    };

    const getTextColor = () => {
        if (disabled) return theme.colors.textSecondary;
        switch (variant) {
            case 'primary': return '#FFFFFF';
            case 'secondary': return theme.colors.text;
            case 'outline': return theme.colors.primary;
            case 'ghost': return theme.colors.text;
            default: return '#FFFFFF';
        }
    };

    const getPadding = () => {
        switch (size) {
            case 'sm': return theme.spacing.xs;
            case 'lg': return theme.spacing.lg;
            default: return theme.spacing.md;
        }
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            disabled={disabled || loading}
            style={[
                styles.container,
                {
                    backgroundColor: getBackgroundColor(),
                    padding: getPadding(),
                    borderRadius: theme.borderRadius.md,
                    borderColor: variant === 'outline' ? theme.colors.primary : 'transparent',
                    borderWidth: variant === 'outline' ? 1 : 0,
                },
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <>
                    {icon}
                    <Text
                        variant={size === 'lg' ? 'h4' : 'body'}
                        weight="medium"
                        color={getTextColor()}
                        style={[
                            icon ? { marginLeft: theme.spacing.sm } : {},
                            textStyle,
                        ]}
                    >
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
