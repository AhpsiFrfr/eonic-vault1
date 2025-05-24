export interface PylonSetting {
  type: 'string' | 'number' | 'boolean';
  default: any;
  label: string;
  min?: number;
  max?: number;
  step?: number;
}

export interface PylonStorage {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  default: any;
}

export interface PylonConfig {
  name: string;
  displayName: string;
  description: string;
  version: string;
  icon: string;
  type: 'widget' | 'app';
  permissions: string[];
  settings: Record<string, PylonSetting>;
  storage: Record<string, PylonStorage>;
} 