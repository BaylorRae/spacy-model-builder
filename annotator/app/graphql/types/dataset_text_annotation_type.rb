module Types
  class DatasetTextAnnotationType < BaseObject
    field :id, Integer, null: false
    field :selection_start, Integer, null: false
    field :selection_end, Integer, null: false

    field :entity, DatasetEntityType, null: false
    field :text, DatasetTextType, null: false
  end
end
