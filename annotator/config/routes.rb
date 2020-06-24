Rails.application.routes.draw do
  root to: 'application#spa'

  if Rails.env.development?
    mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql"
  end
  post "/graphql", to: "graphql#execute"

  get "/*path", to: 'application#spa'
end
