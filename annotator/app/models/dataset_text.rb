class DatasetText < ApplicationRecord
  validates :text, presence: true

  belongs_to :dataset
  has_many :annotations, class_name: 'DatasetTextAnnotation'
end
