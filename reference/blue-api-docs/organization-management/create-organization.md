---
title: Create an Organization
description: How to create a new organization using the Blue API.
icon: Plus
---

To create a new organization, you can use the following mutation:

```graphql
mutation CreateCompany {
  createCompany(input: { name: "new", slug: "new-slug" }) {
    id
  }
}
```

Note that creating new organizations may affect the billing of your Blue account, as each organization is billed separately.


Here are the options for the `createCompany` mutation and their descriptions:

| Option | Type | Description |
|--------|------|-------------|
| name | String | The name of the new organization. This is a required field. |
| slug | String | A URL-friendly version of the organization name. This is used in the organization's URL and should be unique. This is a required field and will also act as the unique identifier for the organization. |
