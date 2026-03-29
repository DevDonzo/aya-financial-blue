# `InvitationCreateInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `email` | `String!` | `` |  |
| `accessLevel` | `UserAccessLevel!` | `` |  |
| `project` | `ProjectCreateOneWithoutInvitationsInput!` | `` |  |
| `invitedBy` | `UserCreateOneWithoutInvitationsInput!` | `` |  |
| `activity` | `ActivityCreateOneInput` | `` |  |
| `expiredAt` | `DateTime` | `` |  |
