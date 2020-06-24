class Dataset < ApplicationRecord
  validates :title, presence: true

  has_many :texts, class_name: 'DatasetText'
end
