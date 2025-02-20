import { FirstLetter } from '../util/types';

export type Category = 'client' | 'agency' | 'attorney';
export type Id = number;
export type Date = `${number}-${number}-${number}`; // YYYY-DD-MM
export type Datetime = `${number}-${number}-${number}T${string}`;
export type Validations = Record<string, string[]>;
export type FormType = `AOC-CR-${number}`; // Example: AOC-CR-287
export type Jurisdiction = 'DISTRICT COURT' | 'SUPERIOR COURT';
export type JurisdictionShortForm = FirstLetter<Jurisdiction>;

// Offense
export type Action = 'ARRAIGNED' | 'CHARGED' | 'CONVICTED';
export type Severity = 'MISDEMEANOR' | 'TRAFFIC' | 'INFRACTION' | 'FELONY';

export interface OffenseRecord {
  pk: Id;
  offense: Id;
  law: string;
  code: number | null;
  action: Action;
  severity: Severity;
  description: string;
  offense_date: Date;
  dob: Date;
  disposition_method: string;
  file_no: string;
}

export interface Offense {
  pk: Id;
  ciprs_record: Id;
  disposed_on: Date;
  disposition_method: string;
  offense_records: OffenseRecord[];
  plea: string;
  verdict: string;
}

export interface CIPRSRecord {
  pk: Id;
  batch: Id;
  date_uploaded: Datetime;
  label: string;
  offenses: Offense[];
}

export interface Contact<T extends Category> {
  pk: Id;
  name: string;
  category: T;
  address1: string;
  address2: string;
  formatted_address: `${Contact<T>['address1']} ${Contact<T>['address2']}`;
  city: string;
  state: string;
  zipcode: string;
}

export type Agency = Contact<'agency'> & { is_sheriff: boolean };
export type Attorney = Contact<'attorney'>;
export type Client = Contact<'client'> & {
  user: Id;
  batches: Id[];
  dob: Date;
};

export interface PetitionDocument {
  pk: Id;
  form_type: FormType;
  county: string;
  jurisdiction: JurisdictionShortForm;
  offense_records: Id[];
}

export interface Petition {
  pk: Id;
  batch: Id;
  form_type: FormType;
  county: string;
  jurisdiction: Jurisdiction;
  offense_records: OffenseRecord[];
  agencies: Agency[];
  documents: Id[];
  generation_errors: Validations;
  base_document: PetitionDocument;
  attachments: Id[];
  active_records: Id[];
}

export interface Batch {
  pk: Id;
  label: string;
  date_uploaded: Datetime;
  user: Id;
  records: CIPRSRecord[];
  petitions: Petition[];
  attorney: Attorney;
  client: Client;
  generate_letter_errors: Validations;
  generate_summary_errors: Validations;
  client_errors: Validations[];
}

export interface User {
  pk: Id;
  username: string;
  email: string;
  is_admin: boolean;
  is_staff: boolean;
  admin_url: string;
  last_login: Datetime;
}

export interface PaginatedResults<T> {
  count: number;
  next: string;
  previous: string;
  results: T[];
}

export interface ImportResults {
  has_errors: boolean;
  row_errors: Record<string, unknown>;
  row_diffs: Agency & { new_fields: (keyof Agency)[] };
}
