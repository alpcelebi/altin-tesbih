import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useTheme } from '../../core/hooks';

interface TextProps extends RNTextProps {
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption';
    color?: string;
    weight?: 'regular' | 'medium' | 'bold';
    align?: 'left' | 'center' | 'right';
}

export const Text: React.FC<TextProps> = ({
    children,
    variant = 'body',
    color,
    weight = 'regular',
    align = 'left',
    style,
    ...props
}) => {
    const theme = useTheme();

    const getFontSize = () => {
        switch (variant) {
            case 'h1': return theme.typography.h1;
            case 'h2': return theme.typography.h2;
            case 'h3': return theme.typography.h3;
            case 'h4': return theme.typography.h4;
            case 'caption': return theme.typography.caption;
            default: return theme.typography.body;
        }
    };

    const getFontWeight = () => {
        switch (weight) {
            case 'bold': return '700';
            case 'medium': return '500';
            default: return '400';
        }
    };

    return (
        <RNText
            style={[
                {
                    fontSize: getFontSize(),
                    fontWeight: getFontWeight(),
                    color: color || theme.colors.text,
                    textAlign: align,
                },
                style,
            ]}
            {...props}
        >
            {children}
        </RNText>
    );
};
