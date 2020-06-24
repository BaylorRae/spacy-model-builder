class DatasetTextAnnotation < ApplicationRecord
  validates :selection_start, presence: true
  validates :selection_end, presence: true

  belongs_to :text, class_name: 'DatasetText'
  belongs_to :entity, class_name: 'DatasetEntity'
end
