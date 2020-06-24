module Types
  class MutationType < Types::BaseObject
    field :text_add_annotation, Types::DatasetTextType, null: false do
      argument :id, Integer, required: true
      argument :annotations, [AnnotationInput], required: true
    end
    def text_add_annotation(id:, annotations:)
      text = DatasetText.find(id)

      DatasetText.transaction do
        text.annotations.destroy_all
        text.update(annotated_at: Time.now)
        annotations.each do |annotation|
          text.annotations.create!(
            dataset_entity_id: annotation.entity_id,
            selection_start: annotation.selection_start,
            selection_end: annotation.selection_end,
          )
        end
      end

      text
    end
  end
end
