module Types
  class DatasetEntityType < BaseObject
    field :id, Integer, null: false
    field :title, String, null: false
    field :color, String, null: false
  end
end
