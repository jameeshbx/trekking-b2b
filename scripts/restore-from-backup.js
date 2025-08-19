#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();
const backupFile = 'database_backups/backup_2025-08-19T07-43-18-052Z.json';

async function restoreData() {
  try {
    console.log('Restoring data from backup...');
    
    if (!fs.existsSync(backupFile)) {
      throw new Error('Backup file not found');
    }
    
    const backup = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    
    // Restore data in order (respecting foreign key constraints)
    const restoreOrder = [
      'File', 'Agency', 'DMC', 'Plan', 'Feature', 'AgencyForm', 'DMCForm',
      'Manager', 'UserForm', 'Admin', 'Staff', 'User', 'PasswordReset',
      'PaymentMethod', 'customers', 'enquiries', 'itineraries', 'customer_feedbacks',
      'sent_itineraries', 'FlightEnquiry', 'AccommodationEnquiry', 'Comment',
      'SharedDMC', 'SharedDMCItem', 'Subscription', 'AgencyCancellationPolicy',
      'email_logs', 'shared_customer_pdfs'
    ];
    
    for (const model of restoreOrder) {
      if (backup[model] && backup[model].length > 0) {
        try {
          console.log(`Restoring ${model}...`);
          
          // Use createMany for better performance, fallback to individual creates
          try {
            await prisma[model].createMany({
              data: backup[model],
              skipDuplicates: true
            });
            console.log(`✓ ${model}: ${backup[model].length} records restored`);
          } catch (error) {
            console.log(`⚠ ${model} createMany failed, trying individual creates: ${error.message}`);
            let successCount = 0;
            for (const record of backup[model]) {
              try {
                await prisma[model].create({
                  data: record
                });
                successCount++;
              } catch (createError) {
                console.log(`⚠ Failed to restore record in ${model}: ${createError.message}`);
              }
            }
            console.log(`✓ ${model}: ${successCount}/${backup[model].length} records restored`);
          }
        } catch (error) {
          console.log(`⚠ ${model}: ${error.message}`);
        }
      }
    }
    
    console.log('✓ Database restore completed successfully!');
    
  } catch (error) {
    console.error(`✗ Restore failed: ${error.message}`);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

restoreData();
