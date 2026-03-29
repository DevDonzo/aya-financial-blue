# `InvitationUpdateInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `email` | `String` | `` |  |
| `accessLevel` | `UserAccessLevel` | `` |  |
| `project` | `ProjectUpdateOneRequiredWithoutInvitationsInput` | `` |  |
| `invitedBy` | `UserUpdateOneRequiredWithoutInvitationsInput` | `` |  |
| `activity` | `ActivityUpdateOneInput` | `` |  |
| `expiredAt` | `DateTime` | `` |  |
