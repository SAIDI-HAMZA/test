import { RouteHandler } from '../../types/route';
import { FilterFactory } from '../../utils/filters';
import * as Schemas from './conversations.schemas';

export const getAll: RouteHandler<typeof Schemas.getAll> = async (req, res) => {
  const filters = new FilterFactory(req.query).parse();
  const conversations = await req.server.prisma.conversation.findMany({
    orderBy: {
      review_due_date: 'desc',
    },
    where: {
      lines: {
        // Empty object checks for at least one line of conversation
        some: filters.languages ? { locale_id: filters.languages } : {},
      },
    },
    select: {
      id: true,
      started_at: true,
      ended_at: true,
      updated_at: true,
      accurate: true,
      review_due_date: true,
      lines: {
        where: {
          locale: {
            locale_short: {
              not: 'fr',
            },
          },
        },
        orderBy: {
          added_at: 'asc',
        },
        select: {
          original_text: true,
          translated_text: true,
          locale: true,
        },
        take: 1,
      },
    },
  });
  const list = conversations.map(({ lines, ...rest }) => ({
    ...rest,
    language:
      lines.find(item => item.locale.locale_short !== 'fr')?.locale
        .locale_long || null,
    preview_original_text:
      lines[0]?.original_text.length >= 50
        ? lines[0]?.original_text.substring(0, 50) + '...'
        : lines[0]?.original_text || null,
    preview_translated_text:
      lines[0]?.translated_text.length >= 50
        ? lines[0]?.translated_text.substring(0, 50) + '...'
        : lines[0]?.translated_text || null,
  }));
  res.code(200).send({
    content: list,
  });
};

export const getByID: RouteHandler<typeof Schemas.getByID> = async (
  req,
  res
) => {
  try {
    const conversation = await req.server.prisma.conversation.findFirst({
      where: {
        id: req.params.id,
      },
      select: {
        id: true,
        display_id: true,
        accurate: true,
        started_at: true,
        ended_at: true,
        review_due_date: true,
        updated_at: true,
        device: {
          select: {
            name: true,
            department: {
              select: {
                id: true,
                name: true,
                hospital: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        lines: {
          select: {
            conversation_audio_id: true,
            locale: {
              select: {
                locale_long: true,
                locale_short: true,
              },
            },
            added_at: true,
            translated_text: true,
            original_text: true,
            speaker: true,
            id: true,
          },
        },
      },
    });
    if (conversation === null) {
      return res.code(404).send({
        message: 'conversation_not_found',
      });
    }
    const conv: (typeof Schemas.getByID)['response']['200']['static']['content'] =
      {
        accurate: conversation.accurate,
        id: conversation.id,
        display_id: conversation.display_id,
        ended_at: conversation.ended_at,
        review_due_date: conversation.review_due_date,
        started_at: conversation.started_at,
        updated_at: conversation.updated_at,
        department: conversation.device.department,
        hospital: conversation.device.department.hospital,
        language:
          conversation.lines.find(item => item.locale.locale_short !== 'fr')
            ?.locale.locale_long || null,
        lines: conversation.lines.map(l => ({
          id: l.id,
          audio: l.conversation_audio_id,
          locale: l.locale,
          original_text: l.original_text,
          translated_text: l.translated_text,
          speaker: l.speaker,
          added_at: l.added_at,
        })),
        device_name: conversation.device.name,
      };
    return res.code(200).send({
      content: conv,
    });
  } catch (err) {
    /* empty */
  }
};

export const getAudioById: RouteHandler<typeof Schemas.getAudioById> = async (
  req,
  res
) => {
  const audio = await req.server.prisma.conversationAudio.findFirst({
    where: {
      id: req.params.id,
    },
  });
  if (!audio) {
    return res.code(404).send({
      message: 'not_found',
    });
  }
  res
    .code(200)
    .type('audio/mp3')
    .send(Buffer.from(audio.audio_path, 'base64') as unknown as string);
};
