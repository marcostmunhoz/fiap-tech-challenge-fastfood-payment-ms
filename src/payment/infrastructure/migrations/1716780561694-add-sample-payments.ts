import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSamplePayments1716780561694 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    queryRunner.query(
      `INSERT INTO payments (id, order_id, total, payment_method, status, external_payment_id, created_at, updated_at) VALUES (
        '096d10bb-5e79-4714-89cd-6d7315533ca9',
        '5105f5e7-514f-4726-bbbc-942c0aeb3d27',
        3000,
        'credit-card',
        'failed',
        NULL,
        NOW(),
        NOW()
      ), (
        'caa009cf-3dc2-4bf5-85a3-2e22f4a356a7',
        '20b63a4b-294a-4e48-b50e-29f5af483515',
        3000,
        'pix',
        'pending',
        '10484722-919c-4bbe-95a2-60907ad4681a',
        NOW(),
        NOW()
      ), (
        '0ad91e7c-eb4f-485b-ae77-df399a2ff6f6',
        'cc492101-9cd0-4713-9029-e9f6686df8f8',
        3500,
        'pix',
        'paid',
        'fc313398-59c4-48f0-b3f9-ef48abc0c9c3',
        NOW(),
        NOW()
      ), (
        '61868dd3-4ae7-4cbc-8886-f271e725c022',
        'ea9838af-693f-40df-8090-cf9dcb88d862',
        2800,
        'credit-card',
        'paid',
        'd663c31a-f6b5-4a67-b648-7e111891b4fb',
        NOW(),
        NOW()
      ), (
        'c84e681b-8872-439e-9675-2272afebe868',
        'ef4277da-bf4a-463d-a383-8047bf572fdc',
        4000,
        'pix',
        'paid',
        'd76f735b-598a-4045-96dc-9e70e8e2995a',
        NOW(),
        NOW()
      ), (
        '4a1eed6f-381c-4a6a-a316-0470764ae866',
        '87340722-135d-4ca2-ab5e-8eb7accd02e4',
        3100,
        'credit-card',
        'paid',
        '8825370f-3f1e-4379-bcd8-2a244c238d9d',
        NOW(),
        NOW()
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    queryRunner.query(`DELETE FROM payments`);
  }
}
