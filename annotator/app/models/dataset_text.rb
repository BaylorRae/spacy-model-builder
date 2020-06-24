class DatasetText < ApplicationRecord
  validates :text, presence: true

  belongs_to :dataset
end
