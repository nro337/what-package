export interface PackageDetails {
  contributions_count: number;
  dependent_repos_count: number;
  dependents_count: number;
  deprecation_reason: string | null;
  description: string | null;
  forks: number;
  homepage: string | null;
  keywords: string[];
  language: string | null;
  latest_download_url: string | null;
  latest_release_number: string | null;
  latest_release_published_at: string | null;
  latest_stable_release_number: string | null;
  latest_stable_release_published_at: string | null;
  liscense_normalized: string | null;
  liscenses: string[] | string | null;
  name: string | null;
  normalized_licenses: string[] | string | null;
  package_manager_url: string | null;
  platform: string | null;
  rank: number | null;
  repository_liscense: string | null;
  repository_status: string | null;
  repository_url: string | null;
  stars: number;
  status: string | null;
  versions: {
    number: string;
    published_at: string;
    spdx_expression: string;
    original_license: string;
    researched_at: string | null;
    repository_resources: string[];
  }[]
}