module Types
  class DatasetTextType < BaseObject
    field :id, Integer, null: false
    field :text, String, null: false
    field :annotated_at, String, null: true

    field :annotations, [DatasetTextAnnotationType], null: false
    field :dataset, DatasetType, null: false
  end
end
