module Types
  class DatasetType < BaseObject
    field :id, Integer, null: false
    field :title, String, null: false

    field :texts, [DatasetTextType], null: false
  end
end
