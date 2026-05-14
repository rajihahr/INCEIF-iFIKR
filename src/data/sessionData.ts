import type { Conversation } from '../types/conversation'
import type { Citation } from '../types/citation'

const oilGasAnswer = `
Oil and gas are subject to zakat (Islamic alms) payment, as established through Quranic verses and scholarly consensus among prominent Muslim jurists [cite:1]. The Quran instructs believers to "spend from the good things which you have earned and from that which We have produced for you from the earth" (Quran 2:267), which scholars interpret as encompassing all minerals, including liquid minerals like petroleum and natural gas [cite:2].

Among the major Islamic jurisprudential schools, there are differing views on scope. The Shafi'i school limits zakat on minerals to gold and silver only, while the Hanbali school — supported by both Al-Qaradawi and Al-Zuhaili — holds that zakat applies to all minerals extracted from the earth, whether solid or liquid [cite:3]. Al-Qaradawi notably observed that oil is referred to as "black gold," and argued that had early scholars known its tremendous value, they would have reached a firm consensus on imposing zakat on it [cite:4].

Regarding the zakat rate, three scholarly positions exist. Abu Hanifah prescribed 20% (one-fifth), analogous to rikaz (buried treasure). Imam Shafi'i suggested 2.5%, by analogy with gold and silver. Imam Malik proposed a variable rate — 2.5% for minerals requiring significant extraction effort and cost, and 20% for those requiring less [cite:5]. Scholars agree that hawl (the one-year holding period) does not apply to minerals; zakat is due immediately upon extraction, by analogy with agricultural produce where zakat is paid at harvest [cite:6].

In Malaysia, despite being a significant oil-producing country, none of the four oil-producing states — Sabah, Sarawak, Kelantan, and Terengganu — have introduced zakat on minerals, including oil and gas [cite:7]. The Petroleum Development Act 1974 and Petroleum (Income Tax) Act 1967 govern oil and gas operations but contain no provisions for zakat [cite:8]. Meanwhile, Saudi Arabia has already implemented zakat on petroleum companies through its General Authority of Zakat and Tax (GAZT), with petroleum companies contributing approximately SAR 750 billion annually [cite:9].

The Islamic Research Center of Al-Azhar University issued a fatwa in 2008 ordering the Egyptian government to pay zakat on oil and gas at a rate of 20%, to be distributed to the poor and needy [cite:10]. While this fatwa was not implemented, it reinforces the scholarly position that oil and gas are minerals subject to zakat. In Malaysia, comprehensive legislative reform would be needed to establish this new zakat provision, requiring coordination between the State Islamic Religious Councils (SIRCs), state assemblies, and federal bodies overseeing petroleum governance [cite:11].
`

export const sampleCitations: Citation[] = [
  {
    cite_id: 1,
    document_title:
      'Establishing Zakat on Oil and Gas in Malaysia: A New Insight',
    authors:
      'Omar, P.M.F.F.A., Gazali, H.M., Samsulbahri, M.N., Razak, N.I.A., Ishak, N.',
    year: 2021,
    source:
      'ISRA International Journal of Islamic Finance, Vol. 13 No. 3, pp. 318–332',
    page: 1,
    section: 'Abstract / Findings',
    cited_text:
      'Oil and gas are subject to zakat payment, as indicated in several Qurʾanic verses and based on the academic reasoning of Muslim scholars.',
    color: '#3B82F6',
  },
  {
    cite_id: 2,
    document_title:
      'Establishing Zakat on Oil and Gas in Malaysia: A New Insight',
    authors: 'Omar et al.',
    year: 2021,
    source: 'ISRA International Journal of Islamic Finance, Vol. 13 No. 3',
    page: 7,
    section: "Al-Qaradāwī and Al-Zuḥailī's viewpoints",
    cited_text:
      "O you have believed, spend from the good things which you have earned and from which We have produced for you from the earth... The phrase '...which We have produced for you from the earth...' is taken by Muslim scholars to mean minerals. The term 'minerals' is generally taken to refer to solid minerals such as gold and silver as well as liquid minerals such as oil and gas; as such, zakat is due upon them.",
    color: '#3B82F6',
  },
  {
    cite_id: 3,
    document_title:
      'Establishing Zakat on Oil and Gas in Malaysia: A New Insight',
    authors: 'Omar et al.',
    year: 2021,
    source: 'ISRA International Journal of Islamic Finance, Vol. 13 No. 3',
    page: 7,
    section: "Al-Qaradāwī and Al-Zuḥailī's viewpoints",
    cited_text:
      "The first opinion is of the Shafiʿī School, which asserted that 'minerals,' as stated in the Qurʾan, refers specifically to gold and silver; hence, zakat on minerals is only imposable on the two. The second opinion is of Abu Hanifah... The third opinion is of the Hanbalī School, which proclaimed that zakat is applicable on all types and forms of minerals extracted from the earth.",
    color: '#3B82F6',
  },
  {
    cite_id: 4,
    document_title:
      'Establishing Zakat on Oil and Gas in Malaysia: A New Insight',
    authors: 'Omar et al.',
    year: 2021,
    source: 'ISRA International Journal of Islamic Finance, Vol. 13 No. 3',
    page: 7,
    section: "Al-Qaradāwī and Al-Zuḥailī's viewpoints",
    cited_text:
      "Al-Qaradāwī added that oil is referred to as 'black gold,' which emphasizes its value; he believes that if past scholars had known about their tremendous value, they would have reached a solid consensus on how zakat is to be imposed on them.",
    color: '#3B82F6',
  },
  {
    cite_id: 5,
    document_title:
      'Establishing Zakat on Oil and Gas in Malaysia: A New Insight',
    authors: 'Omar et al.',
    year: 2021,
    source: 'ISRA International Journal of Islamic Finance, Vol. 13 No. 3',
    page: 8,
    section: "Al-Qaradāwī and Al-Zuḥailī's viewpoints",
    cited_text:
      'The first opinion is of Abu Hanifah, who asserted that the rate should be 20% (one-fifth)... The second opinion is of Shafiʿī, who suggested a rate of 2.5% based on analogy with zakat on gold and silver. The third opinion is of Imam Malik, who asserted a zakat rate of either 2.5% or 20%, depending on the cost and effort of extracting the minerals.',
    color: '#3B82F6',
  },
  {
    cite_id: 6,
    document_title:
      'Establishing Zakat on Oil and Gas in Malaysia: A New Insight',
    authors: 'Omar et al.',
    year: 2021,
    source: 'ISRA International Journal of Islamic Finance, Vol. 13 No. 3',
    page: 8,
    section: "Al-Qaradāwī and Al-Zuḥailī's viewpoints",
    cited_text:
      'The scholars agree that there is no ḥawl (one-year zakat maturity requirement) for zakat on minerals, by analogy with zakat on agricultural yields whereby zakat is paid at the time of harvest.',
    color: '#3B82F6',
  },
  {
    cite_id: 7,
    document_title:
      'Establishing Zakat on Oil and Gas in Malaysia: A New Insight',
    authors: 'Omar et al.',
    year: 2021,
    source: 'ISRA International Journal of Islamic Finance, Vol. 13 No. 3',
    page: 6,
    section: 'Zakat al-māl collection',
    cited_text:
      'Remarkably, some of the oil-producing states do not collect zakat on minerals; in fact, there is no such category as minerals on their zakat list.',
    color: '#3B82F6',
  },
  {
    cite_id: 8,
    document_title:
      'Establishing Zakat on Oil and Gas in Malaysia: A New Insight',
    authors: 'Omar et al.',
    year: 2021,
    source: 'ISRA International Journal of Islamic Finance, Vol. 13 No. 3',
    page: 9,
    section: 'Legislation of oil and gas in Malaysia',
    cited_text:
      'The Petroleum Development Act 1974 defines petroleum as the umbrella term for crude oil, natural gas and all forms of petroleum... Sections 2(1) and 3 A(1) under the same Act specify that all matters related to petroleum ownership, rights, exploitation and explorations in Malaysia are to be administered by the governing company, known as Petroliam Nasional Berhad (PETRONAS).',
    color: '#3B82F6',
  },
  {
    cite_id: 9,
    document_title:
      'Establishing Zakat on Oil and Gas in Malaysia: A New Insight',
    authors: 'Omar et al.',
    year: 2021,
    source: 'ISRA International Journal of Islamic Finance, Vol. 13 No. 3',
    page: 2,
    section: 'Introduction',
    cited_text:
      'In Saudi Arabia, petroleum companies contribute approximately SAR750bn annually in zakat and tax. Zakat is also imposed on all petroleum and gas companies operating in the country, and it is nationally administered under the General Authority of Zakat and Tax (GAZT) of Saudi Arabia.',
    color: '#3B82F6',
  },
  {
    cite_id: 10,
    document_title:
      'Establishing Zakat on Oil and Gas in Malaysia: A New Insight',
    authors: 'Omar et al.',
    year: 2021,
    source: 'ISRA International Journal of Islamic Finance, Vol. 13 No. 3',
    page: 8,
    section: 'Contemporary fatwas on zakat on oil and gas',
    cited_text:
      'The Islamic Research Center of Al-Azhar University issued a fatwa in 2008 ordering the Egyptian government to pay zakat on its oil and gas at a rate of 20%, to be distributed to the poor and needy of the country.',
    color: '#3B82F6',
  },
  {
    cite_id: 11,
    document_title:
      'Establishing Zakat on Oil and Gas in Malaysia: A New Insight',
    authors: 'Omar et al.',
    year: 2021,
    source: 'ISRA International Journal of Islamic Finance, Vol. 13 No. 3',
    page: 10,
    section: 'Crux of the matter',
    cited_text:
      'In Malaysia, zakat management is under the purview of the SIRC. Undoubtedly, several aspects regarding zakat collection and disbursement require further improvement. However, the crux of the matter still revolves around the development of a new zakat al-māl, which is very much related to zakat administration and its regulatory provisions.',
    color: '#3B82F6',
  },
]

const zakatSavingsAnswer = `
A frequent misconception is that zakat applies only to cash hoarded at home. In classical fiqh, zakat on wealth (zakat al-māl) generally covers gold, silver, cash, trade goods, and agricultural produce subject to niṣāb and ḥawl where applicable—bank deposits and savings are typically treated as monetary wealth when they meet the threshold.

Another misconception is that zakat and income tax are interchangeable. Zakat is a religious obligation with specific beneficiaries (aṣnāf) and rulings; tax is a state levy. They may overlap in practice for institutions, but the aims and distributions differ.

A third pitfall is delaying payment without a valid excuse after a full lunar year passes on qualifying wealth. Scholars encourage estimating conservatively and paying on time rather than postponing out of uncertainty; when in doubt, local zakat authorities or qualified scholars can clarify niṣāb and rates for your jurisdiction.
`

export const sessionConversations: Conversation[] = [
  {
    id: 'conv-oil-gas-zakat',
    title: 'Zakat on oil & gas (Malaysia)',
    subtitle: 'Cited answer',
    question:
      'What is the Islamic ruling on zakat for oil and gas in Malaysia?',
    answer: oilGasAnswer,
    citations: sampleCitations,
  },
  {
    id: 'conv-zakat-savings',
    title: 'Zakat on savings — misconceptions',
    subtitle: 'General guidance',
    question: 'What are common misconceptions about zakat on savings?',
    answer: zakatSavingsAnswer,
    citations: [],
  },
]
