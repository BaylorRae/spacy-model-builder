module Types
  class AnnotationInput < BaseInputObject
    argument :entity_id, Integer, required: true
    argument :selection_start, Integer, required: true
    argument :selection_end, Integer, required: true
  end
end
