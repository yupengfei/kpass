package api

import (
	"github.com/seccom/kpass/src/auth"
	"github.com/seccom/kpass/src/bll"
	"github.com/seccom/kpass/src/schema"
	"github.com/seccom/kpass/src/util"
	"github.com/teambition/gear"
)

// Secret is API oject for secrets
//
// @Name Secret
// @Description Secret API
// @Accepts json
// @Produces json
type Secret struct {
	CommonAPI
	secretBll *bll.Secret
}

// Init ...
func (a *Secret) Init(api CommonAPI) *Secret {
	a.CommonAPI = api
	a.secretBll = api.blls.Secret
	return a
}

type tplSecretCreate struct {
	Name string `json:"name" swaggo:"true,secret name,Login"`
	URL  string `json:"url" swaggo:"false,some URL,https://github.com/login"`
	Pass string `json:"password" swaggo:"false,some password,mYPaSsWoRd"`
	Note string `json:"note" swaggo:"false,some note,https://github.com/login"`
}

func (t *tplSecretCreate) Validate() error {
	if (len(t.Name) + len(t.URL) + len(t.Pass) + len(t.Note)) == 0 {
		return gear.ErrBadRequest.WithMsg("content required")
	}
	return nil
}

// Create ...
//
// @Title Create
// @Summary Create a secret in a entry
// @Description all team members can create secret
// @Param Authorization header string true "access_token"
// @Param entryID path string true "entry ID"
// @Param body body tplSecretCreate true "secret body"
// @Success 200 schema.SecretResult
// @Failure 400 string
// @Failure 401 string
// @Router POST /api/entries/{entryID}/secrets
func (a *Secret) Create(ctx *gear.Context) error {
	EntryID, err := util.ParseOID(ctx.Param("entryID"))
	if err != nil {
		return gear.ErrBadRequest.From(err)
	}

	body := new(tplSecretCreate)
	if err := ctx.ParseBody(body); err != nil {
		return gear.ErrBadRequest.From(err)
	}

	key, err := auth.KeyFromCtx(ctx)
	if err != nil {
		return gear.ErrUnauthorized.From(err)
	}
	userID, _ := auth.UserIDFromCtx(ctx)

	secretResult, err := a.secretBll.Create(userID, key, EntryID, &schema.Secret{
		Name: body.Name,
		URL:  body.URL,
		Pass: body.Pass,
		Note: body.Note,
	})
	if err != nil {
		return gear.ErrInternalServerError.From(err)
	}
	return ctx.JSON(200, secretResult)
}

type tplSecretUpdate map[string]interface{}

// Validate ...
func (t *tplSecretUpdate) Validate() error {
	empty := true
	for key, val := range *t {
		empty = false
		switch key {
		case "name", "url", "password", "note":
			if _, ok := val.(string); !ok {
				return gear.ErrBadRequest.WithMsg("invalid secret property")
			}
		default:
			return gear.ErrBadRequest.WithMsg("invalid secret property")
		}
	}

	if empty {
		return gear.ErrBadRequest.WithMsg("no content")
	}
	return nil
}

// Update ...
//
// @Title Update
// @Summary Update the secret
// @Description all team members can update the secret
// @Param Authorization header string true "access_token"
// @Param entryID path string true "entry ID"
// @Param secretID path string true "secret ID"
// @Param body body tplSecretUpdate true "secret body"
// @Success 200 schema.SecretResult
// @Failure 400 string
// @Failure 401 string
// @Router PUT /api/entries/{entryID}/secrets/{secretID}
func (a *Secret) Update(ctx *gear.Context) error {
	EntryID, err := util.ParseOID(ctx.Param("entryID"))
	if err != nil {
		return gear.ErrBadRequest.From(err)
	}
	SecretID, err := util.ParseOID(ctx.Param("secretID"))
	if err != nil {
		return gear.ErrBadRequest.From(err)
	}

	body := new(tplSecretUpdate)
	if err := ctx.ParseBody(body); err != nil {
		return gear.ErrBadRequest.From(err)
	}

	key, err := auth.KeyFromCtx(ctx)
	if err != nil {
		return gear.ErrUnauthorized.From(err)
	}
	userID, _ := auth.UserIDFromCtx(ctx)
	res, err := a.secretBll.Update(userID, key, EntryID, SecretID, *body)
	if err != nil {
		return gear.ErrInternalServerError.From(err)
	}
	return ctx.JSON(200, res)
}

// Delete ...
//
// @Title Delete
// @Summary Delete the secret
// @Description all team members can delete the secret
// @Param Authorization header string true "access_token"
// @Param entryID path string true "entry ID"
// @Param secretID path string true "secret ID"
// @Success 204
// @Failure 400 string
// @Failure 401 string
// @Router DELETE /api/entries/{entryID}/secrets/{secretID}
func (a *Secret) Delete(ctx *gear.Context) error {
	EntryID, err := util.ParseOID(ctx.Param("entryID"))
	if err != nil {
		return gear.ErrBadRequest.From(err)
	}
	SecretID, err := util.ParseOID(ctx.Param("secretID"))
	if err != nil {
		return gear.ErrBadRequest.From(err)
	}
	userID, err := auth.UserIDFromCtx(ctx)
	if err != nil {
		return gear.ErrUnauthorized.From(err)
	}

	if err := a.secretBll.Delete(EntryID, SecretID, userID); err != nil {
		return gear.ErrInternalServerError.From(err)
	}
	return ctx.End(204)
}
