class CreateDatasetTextAnnotations < ActiveRecord::Migration[6.0]
  def change
    create_table :dataset_text_annotations do |t|
      t.belongs_to :dataset_text, null: false, foreign_key: true
      t.integer :selection_start, null: false
      t.integer :selection_end, null: false
      t.belongs_to :dataset_entity, null: false, foreign_key: true

      t.timestamps
    end
  end
end
