import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePayments1716417934428 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `CREATE TABLE payments (
        id VARCHAR(36) NOT NULL,
        order_id VARCHAR(36) NOT NULL,
        total INT UNSIGNED NOT NULL,
        payment_method VARCHAR(20) NOT NULL,
        status VARCHAR(20) NOT NULL,
        external_payment_id VARCHAR(36),
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL,
        CONSTRAINT payments_pk_index PRIMARY KEY (id)
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`DROP TABLE payments`);
  }
}
