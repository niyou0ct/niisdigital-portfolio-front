/* eslint-disable import/prefer-default-export */
import nodemailer from 'nodemailer'
import { Contact } from '@/models/Contact'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD
  }
})

/**
 *
 * @param params
 */
const sendEmailToAdmin = async (params: Contact): Promise<any> => {
  const { email, name, detail } = params

  const message = {
    from: process.env.EMAIL_ADDRESS,
    to: process.env.EMAIL_ADDRESS,
    subject: `お問い合わせがありました`,
    text: `■メールアドレス\n${email}\n\n■お名前\n${name}\n\n■お問い合わせ内容\n${detail}`
  }

  const response = await transporter
    .sendMail(message)
    .then((res) => res)
    .catch((err) => err)
  return response
}

/**
 *
 * @param params
 */
const sendEmailToClient = async (params: Contact): Promise<any> => {
  const { email, name, detail } = params
  const greetingText =
    'この度はお問い合わせ誠にありがとうございます。自動でお送りするメールのためこちらへの返信は不要です。\n=========================\nお問い合わせしていただいた内容\n=========================\n'

  const message = {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: `amefurashiへお問い合わせありがとうございます`,
    text: `${greetingText}■メールアドレス\n${email}\n\n■お名前\n${name}\n\n■お問い合わせ内容\n${detail}`
  }

  const response = await transporter
    .sendMail(message)
    .then((res) => res)
    .catch((err) => err)
  return response
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async (
  req: { body: { params: string } },
  res: {
    json: (arg0: {
      result: boolean
      clientResult: any
      adminResult: any
    }) => void
  }
) => {
  const jsonParams = JSON.parse(req.body.params) as Contact
  const clientRes = await sendEmailToClient(jsonParams)
  const adminRes = await sendEmailToAdmin(jsonParams)

  res.json({ result: true, clientResult: clientRes, adminResult: adminRes })
}