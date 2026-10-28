import * as migration_20261028_144416_initial_content_model from './20261028_144416_initial_content_model';

export const migrations = [
  {
    up: migration_20261028_144416_initial_content_model.up,
    down: migration_20261028_144416_initial_content_model.down,
    name: '20261028_144416_initial_content_model',
  },
];
