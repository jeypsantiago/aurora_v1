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

export interface SupplySignatures {
  requester?: string;
  requesterDesignation?: string;
  requesterSigUrl?: string;

  verifier?: string;
  verifierDesignation?: string;
  verifierSigUrl?: string;

  approver?: string;
  approverDesignation?: string;
  approverSigUrl?: string;

  issuer?: string;
  issuerDesignation?: string;
  issuerSigUrl?: string;

  receiver?: string;
  receiverDesignation?: string;
  receiverSigUrl?: string;
}