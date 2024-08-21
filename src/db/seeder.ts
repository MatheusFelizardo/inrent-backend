import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { dataSourceOptions } from './data-source';
import { Labels } from '../properties/entities/labels.entity';
dotenv.config();

const dataSource = new DataSource(dataSourceOptions);

async function runSeeder() {
  try {
    await dataSource.initialize();
    const labelsRepository = dataSource.getRepository(Labels);
    const options = [
      'exterior',
      'interior',
      'bedroom',
      'living_room',
      'kitchen',
      'bathroom',
      'view',
      'outdoor_area',
      'floor_plan',
      'other',
    ];

    for (const option of options) {
      const label = new Labels();
      label.label = option;
      await labelsRepository.save(label);
    }
    console.log('Labels seeder executed successfully');
  } catch (error) {
    console.error('Error running seeder:', error);
  } finally {
    await dataSource.destroy();
  }
}

runSeeder();
