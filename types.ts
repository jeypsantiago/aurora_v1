import React from 'react';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ElementType;
}

export interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

// Using const object instead of enum to avoid parsing issues in some environments
export const Theme = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

export type Theme = typeof Theme[keyof typeof Theme];