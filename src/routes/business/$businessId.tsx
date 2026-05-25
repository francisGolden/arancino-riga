import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/business/$businessId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { businessId } = Route.useParams()
  return <div>{businessId} page</div>
}
