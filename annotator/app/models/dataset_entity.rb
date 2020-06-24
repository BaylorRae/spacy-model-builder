class DatasetEntity < ApplicationRecord
  validates :title, presence: true
  validates :color, presence: true

  belongs_to :dataset
end
