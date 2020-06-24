class CreateDatasetTexts < ActiveRecord::Migration[6.0]
  def change
    create_table :dataset_texts do |t|
      t.belongs_to :dataset, null: false, foreign_key: true
      t.text :text, null: false

      t.timestamps
    end
  end
end
