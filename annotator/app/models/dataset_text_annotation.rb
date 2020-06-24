class DatasetTextAnnotation < ApplicationRecord
  validates :selection_start, presence: true
  validates :selection_end, presence: true

  belongs_to :text, class_name: 'DatasetText', foreign_key: :dataset_text_id, optional: true
  belongs_to :entity, class_name: 'DatasetEntity', foreign_key: :dataset_entity_id, optional: true
end
