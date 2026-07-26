import {
  EcomApiKeysConfig,
  SmtpConfig,
  WebhookConfig,
  SecuritySystemConfig,
  ConfigAuditLog,
} from '@/types';
export interface SystemConfig {
  r2: {
    account_id: string;
    access_key_id: string;
    secret_access_key_masked: string;
    bucket_name: string;
    custom_domain: string;
    region: string;
    enabled: boolean;
  };
  supabase: {
    project_url: string;
    anon_key_masked: string;
    service_role_key_masked: string;
    db_name: string;
    max_connections: number;
    enabled: boolean;
  };
  voip: {
    provider_name: string;
    api_endpoint: string;
    api_key_masked: string;
    recording_retention_days: number;
    enabled: boolean;
  };
  api_keys: EcomApiKeysConfig;
  smtp: SmtpConfig;
  webhook: WebhookConfig;
  security: SecuritySystemConfig;
  audit_logs: ConfigAuditLog[];
}

const DEFAULT_CONFIG: SystemConfig = {
  r2: {
    account_id: '8f920a14b302e912384756c9a0123456',
    access_key_id: 'r2_access_ggbingo_prod_2026',
    secret_access_key_masked: '••••••••••••••••••••••••••••••••',
    bucket_name: 'ggbingo-crm-contracts-storage',
    custom_domain: 'storage.ggbingo.vn',
    region: 'auto',
    enabled: true,
  },
  supabase: {
    project_url: 'https://ggbingo-crm-prod.supabase.co',
    anon_key_masked: 'eyJhYmdj...••••••••••••••••••••••••',
    service_role_key_masked: 'eyJhYmdj...••••••••••••••••••••••••',
    db_name: 'postgres_ggbingo_crm',
    max_connections: 100,
    enabled: true,
  },
  voip: {
    provider_name: 'Cloud Telephony Gateway Vietnam',
    api_endpoint: 'https://api.telephony.ggbingo.vn/v1',
    api_key_masked: 'voip_sec_••••••••••••••••',
    recording_retention_days: 180,
    enabled: true,
  },
  api_keys: {
    shopee_app_key: 'shp_app_2026889900',
    shopee_app_secret: 'shp_sec_••••••••••••••••••••',
    tiktok_app_key: 'ttk_partner_889911',
    tiktok_app_secret: 'ttk_sec_••••••••••••••••••••',
    lazada_app_key: 'lzd_app_778899',
    lazada_app_secret: 'lzd_sec_••••••••••••••••••••',
    amazon_seller_id: 'AMZ_SELLER_VN_2026',
    amazon_lwa_client_id: 'amzn1.application-oa2-client.••••••••',
    gemini_api_key: 'AIzaSyB••••••••••••••••••••••••••••',
    openai_api_key: 'sk-proj-••••••••••••••••••••••••••••',
  },
  smtp: {
    host: 'smtp.mailgun.org',
    port: 587,
    encryption: 'TLS',
    username: 'postmaster@ggbingo.vn',
    password_masked: '••••••••••••••••',
    sender_email: 'no-reply@ggbingo.vn',
    sender_name: 'GGBingo CRM System Notification',
  },
  webhook: {
    telegram_bot_token: '7891234560:AAH••••••••••••••••••••••••',
    telegram_chat_id: '-1001982736450',
    zalo_zns_webhook_url: 'https://api.zalo.me/v2.0/oa/message',
    zalo_app_id: '202688991122',
    notify_on_new_lead: true,
    notify_on_kpi_deadline: true,
    notify_on_employee_onboard: true,
  },
  security: {
    max_file_size_mb: 50,
    session_timeout_mins: 120,
    max_failed_logins: 5,
    maintenance_mode: false,
    maintenance_message: 'Hệ thống đang được nâng cấp bảo trì định kỳ. Vui lòng quay lại sau 15 phút.',
  },
  audit_logs: [
    {
      id: 'log_cfg_1',
      section: 'Sàn TMĐT & AI API Keys',
      actor_name: 'Super Admin',
      action: 'UPDATE_API_KEY',
      details: 'Cập nhật Google Gemini API Key và Shopee Partner Key',
      timestamp: '2026-07-24 08:00',
    },
    {
      id: 'log_cfg_2',
      section: 'Máy Chủ Email SMTP',
      actor_name: 'Super Admin',
      action: 'TEST_SMTP',
      details: 'Gửi mail thử nghiệm thành công tới no-reply@ggbingo.vn',
      timestamp: '2026-07-24 08:15',
    },
  ],
};

let currentConfig: SystemConfig = { ...DEFAULT_CONFIG };

export function getSystemConfig(): SystemConfig {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('ggbg_system_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_CONFIG, ...parsed };
      } catch {
        return currentConfig;
      }
    }
  }
  return currentConfig;
}

export function saveSystemConfig(newConfig: SystemConfig, actorName: string = 'Super Admin', changeDetails?: string): SystemConfig {
  const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
  const newLog: ConfigAuditLog = {
    id: `log_cfg_${Date.now()}`,
    section: 'Cấu Hình Tổng Thể',
    actor_name: actorName,
    action: 'UPDATE_CONFIG',
    details: changeDetails || 'Cập nhật cấu hình tích hợp hệ thống',
    timestamp: now,
  };

  const updatedConfig = {
    ...newConfig,
    audit_logs: [newLog, ...(newConfig.audit_logs || [])],
  };

  currentConfig = { ...updatedConfig };

  if (typeof window !== 'undefined') {
    localStorage.setItem('ggbg_system_config', JSON.stringify(updatedConfig));
  }
  return currentConfig;
}
