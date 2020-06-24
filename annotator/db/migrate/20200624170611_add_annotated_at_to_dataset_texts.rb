class AddAnnotatedAtToDatasetTexts < ActiveRecord::Migration[6.0]
  def change
    add_column :dataset_texts, :annotated_at, :datetime
  end
end
