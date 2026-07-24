export type StorePlatform = 'Shopee Mall' | 'TikTok Shop' | 'Lazada' | 'Amazon' | 'GGBingoVN';
export type HealthRating = 'EXCELLENT' | 'GOOD' | 'WARNING' | 'CRITICAL';

export interface EcomStore {
  id: string;
  store_code: string;
  store_name: string;
  customer_name: string;
  company_name: string;
  platform: StorePlatform;
  store_url: string;
  monthly_gmv_actual: number;
  monthly_gmv_target: number;
  health_rating: HealthRating;
  cancellation_rate_percent: number;
  late_shipment_rate_percent: number;
  rating_score: number;
  owner_ops_name: string;
  connected_at: string;
}
