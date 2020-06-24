class Dataset < ApplicationRecord
  validates :title, presence: true

  has_many :entities, class_name: 'DatasetEntity'
  has_many :texts, class_name: 'DatasetText'
end
