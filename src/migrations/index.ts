import * as migration_20261028_144416_initial_content_model from './20261028_144416_initial_content_model';
import * as migration_20261028_211500_contact_request_safety from './20261028_211500_contact_request_safety';

export const migrations = [
  {
    up: migration_20261028_144416_initial_content_model.up,
    down: migration_20261028_144416_initial_content_model.down,
    name: '20261028_144416_initial_content_model',
  },
  {
    up: migration_20261028_211500_contact_request_safety.up,
    down: migration_20261028_211500_contact_request_safety.down,
    name: '20261028_211500_contact_request_safety',
  },
];
