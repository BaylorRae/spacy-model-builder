module Types
  class DatasetTextType < BaseObject
    field :id, Integer, null: false
    field :text, String, null: false

    field :annotations, [DatasetTextAnnotationType], null: false
    field :dataset, DatasetType, null: false
  end
end
