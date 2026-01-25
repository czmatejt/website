import { redirect } from "react-router";

// The loader runs on the server before the page renders
export function loader() {
  return redirect("https://atletickyklubkurim.webnode.cz/");
}

export default function PublicRedirect() {
  return null; // This never renders because the loader redirects first
}