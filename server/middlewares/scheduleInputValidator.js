const Joi = require('joi');

module.exports = (req, res, next) => {
  const { body } = req;
  const schema = Joi.object().keys({
    talks: Joi.array()
      .min(1)
      .items(
        Joi.object().keys({
          talkTitle: Joi.string().required(),
          duration: Joi.number().required(),
          speakers: Joi.string().required()
        })
      )
      .required()
  });
  const result = Joi.validate(body, schema);
  if (result.error) {
    const { details } = result.error;
    const message = details.map(i => i.message).join(',');
    res.status(422).json({ error: message });
  } else {
    next();
  }
};
