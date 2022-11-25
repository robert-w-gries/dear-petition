import { State } from '~/src/constants/US_STATES';

export type Contact = {
  pk: number;
  name: string;
  category: string;
  address1: string;
  address2: string;
  formatted_address: string;
  city: string;
  state: State[0];
  zipcode: string;
};

export type ArrestingAgency = Contact;
export type Attorney = Contact;

export type CIPRSRecord = {
  pk: number;
  batch: number;
  date_uploaded: string;
  label: string;
  offenses: Offense[];
};

export type Jurisdiction = 'DISTRICT COURT' | 'SUPERIOR COURT';

export type Offense = {
  pk: number;
  ciprs_record: number;
  disposed_on: string;
  disposition_method: string;
  offense_records: OffenseRecord[];
  plea: string;
  verdict: string;
};

export type OffenseAction = 'ARRAIGNED' | 'CHARGED' | 'CONVICTED';
export type OffenseSeverity = 'MISDEMEANOR' | 'TRAFFIC' | 'INFRACTION' | 'FELONY';

export type OffenseRecord = {
  pk: number;
  offense: number;
  law: string;
  code: number | null;
  action: OffenseAction;
  severity: OffenseSeverity;
  description: string;
  offense_date: string;
  dob: string | null;
  disposition_method: string;
  file_no: string;
};

export type Petition = {
  pk: number;
  form_type: string;
  county: string;
  jurisdiction: Jurisdiction;
  offense_records: OffenseRecord[];
  agencies: ArrestingAgency[];
  base_document: PetitionDocument;
  attachments: PetitionDocument[];
  active_records: number[];
};

export type PetitionDocument = {
  pk: number;
  form_type: string;
  county: string;
  jurisdiction: Jurisdiction;
  offense_records: number[];
};

export type User = {
  pk: number;
  username: string;
  email: string;
  is_admin: boolean;
  is_staff: boolean;
  admin_url: string;
  last_login: string;
};
