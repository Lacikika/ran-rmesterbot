/*const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

const questions = [
  {
    question: 'Mi a fővárosa Magyarországnak?',
    options: [
      { label: 'Budapest', correct: true },
      { label: 'Debrecen', correct: false },
      { label: 'Szeged', correct: false },
      { label: 'Pécs', correct: false },
    ],
  },
  {
    question: 'Mi a legnagyobb magyarországi tó?',
    options: [
      { label: 'Balaton', correct: true },
      { label: 'Velencei-tó', correct: false },
      { label: 'Fertő-tó', correct: false },
      { label: 'Tisza-tó', correct: false },
    ],
  },
  // Add more questions here...
];

const quiz = {
  currentQuestion: 0,
  score: 0,
};

const getButtonStyle = (correct) => {
  return correct ? ButtonStyle.Success : ButtonStyle.Success;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quiz')
    .setDescription('Egy kérdés a privát üzenetedben'),
  async execute(interaction) {
    const user = interaction.user;
    const embed = new EmbedBuilder()
      .setTitle('Quiz')
      .setDescription(questions[quiz.currentQuestion].question);
    const row = new ActionRowBuilder();
    questions[quiz.currentQuestion].options.forEach((option) => {
      row.addComponents(
        new ButtonBuilder()
          .setLabel(option.label)
          .setStyle(getButtonStyle(option.correct))
          .setCustomId(option.label),
      );
    });
    const message = await user.send({ embeds: [embed], components: [row] });
    const collector = message.createMessageComponentCollector({ time: 60000 });

    collector.on('collect', (i) => {
      if (i.customId === questions[quiz.currentQuestion].options.find((option) => option.correct).label) {
        quiz.score++;
        i.reply({ content: 'Helyes válasz!', ephemeral: true });
      } else {
        i.reply({ content: 'Sajnálom, rossz válasz!', ephemeral: true });
      }
      quiz.currentQuestion++;
      if (quiz.currentQuestion >= questions.length) {
        const finalScore = `Pontszám: ${quiz.score} / ${questions.length}`;
        if (quiz.score >= 7) {
          // Give the user a role in the server
          const role = interaction.guild.roles.cache.find((role) => role.name === 'Quiz Champion');
          user.roles.add(role);
          user.send(`Gratulálok! Megnyerted a quizet és mostantól a Quiz Champion szerepet viseled!`);
        } else {
          user.send(finalScore);
        }
      } else {
        const nextQuestion = questions[quiz.currentQuestion];
        const nextEmbed = new EmbedBuilder()
          .setTitle('Quiz')
          .setDescription(nextQuestion.question);
        const nextRow = new ActionRowBuilder();
        nextQuestion.options.forEach((option) => {
          nextRow.addComponents(
            new ButtonBuilder()
              .setLabel(option.label)
              .setStyle(getButtonStyle(option.correct))
              .setCustomId(option.label),
          );
        });
        user.send({ embeds: [nextEmbed], components: [nextRow] });
      }
    });
  },
};
*/