module Types
  class MutationType < Types::BaseObject
    field :text_add_annotation, Types::DatasetTextType, null: false do
      argument :id, Integer, required: true
      argument :annotations, [AnnotationInput], required: true
    end
    def text_add_annotation(id:, annotations:)
      text = DatasetText.find(id)

      text.annotations.destroy_all
      annotations.each do |annotation|
        text.annotations.create!(
          dataset_entity_id: annotation.entity_id,
          selection_start: annotation.selection_start,
          selection_end: annotation.selection_end,
        )
      end

      text
    end
  end
end
