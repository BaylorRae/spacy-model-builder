class CreateDatasets < ActiveRecord::Migration[6.0]
  def change
    create_table :datasets do |t|
      t.string :title, null: false

      t.timestamps
    end
  end
end
