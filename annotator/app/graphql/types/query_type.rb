module Types
  class QueryType < Types::BaseObject
    field :dataset, Types::DatasetType, null: false do
      argument :id, Integer, required: true
    end
    def dataset(id:)
      Dataset.find(id)
    end

    field :datasets, [Types::DatasetType], null: false
    def datasets
      Dataset.order(created_at: :desc)
    end

    field :text, Types::DatasetTextType, null: false do
      argument :id, Integer, required: true
    end
    def text(id:)
      DatasetText.find(id)
    end
  end
end
