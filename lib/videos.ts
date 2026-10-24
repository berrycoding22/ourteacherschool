export type Video = {
  id: number;
  title_km: string;
  youtube_id: string;
  description_km: string | null;
};

// These are shown until videos are added in the Admin Dashboard.
export const defaultVideos: Video[] = [
  { id: 1, title_km: "💁‍♀️ហេតុអ្វីបានជាសិស្សានុសិស្សពិបាកក្នុងការដោះស្រាយចំណោទ?", youtube_id: "vrsz0mPgqMM", description_km: null },
  { id: 2, title_km: "💁‍♀️ហេតុអ្វីបានជាសិស្សខ្សោយការអាន និងសរសេរភាសាខ្មែរ?", youtube_id: "oJs5lGB-CUo", description_km: null },
  { id: 3, title_km: "ថ្នាក់ទី២ មេរៀនទី២០ ព្យព្ជានៈផ្ញើជើង | អ្នកគ្រូ សារ៉ាត់ ប្រាស្នា", youtube_id: "opwNDRbL1Q0", description_km: null },
  { id: 4, title_km: "ថ្នាក់ទី៣ ចំណោត ប្រមាណវិធីចែក | អ្នកគ្រូ សារ៉ាត់ ប្រាស្នា", youtube_id: "VJs3nA5GJB0", description_km: null },
  { id: 5, title_km: "ថ្នាក់ទី៤ គណិតវិទ្យា ចំណោទប្រមាណវិធីគុណ | អ្នកគ្រូ ណាល់ មុន្នីនាថ", youtube_id: "QLpjpW8sHnE", description_km: null },
  { id: 6, title_km: "ថ្នាក់ទី៦ មេរៀនគណិតវិទ្យា | អ្នកគ្រូ ប៉ន ចាន់ស្រីណែត", youtube_id: "VKhmuJeCst4?list=PLQlRIEGekd-HUht0LFH4o-CgMGfcKwwrX", description_km: null },
  { id: 7, title_km: "ថ្នាក់ទី៧ គណិតវិទ្យា ការសរសេរចំនួនទសភាគខួបជាប្រភាគ", youtube_id: "K2Q9BBvugVA", description_km: null },
  { id: 8, title_km: "ថ្នាក់ទី៨ គីមីវិទ្យា គណនាម៉ាសសូលុយស្យុង និងម៉ាសទឹក", youtube_id: "R70oRXMjjJo", description_km: null },
  { id: 9, title_km: "ថ្នាក់ទី៩ គណិតវិទ្យា ឬសការ៉េតគ្នា", youtube_id: "vArYnYAcp-M?list=PLQlRIEGekd-EOEtUEL8KvT0M9ri_i2dx9", description_km: null },
  { id: 10, title_km: "ថ្នាក់ទី៩ ដោះស្រាយប្រព័ន្ធវិសមីការ", youtube_id: "kgYUnV5d1U4", description_km: null },
  { id: 11, title_km: "ថ្នាក់ទី៩ វិញ្ញាសាររូបវិទ្យា ត្រៀមប្រឡងឌីប្លូម ២០២៥", youtube_id: "ZV1Sg41N9wM?list=PLQlRIEGekd-GrzhchDmXZB4oak82wCet3", description_km: null },
  { id: 12, title_km: "ថ្នាក់ទី១០ រូបវិទ្យា ការគណនាប្រេកង់តង់ស្យុងឆ្លាស់", youtube_id: "vIX7U3nnQW4", description_km: null },
  { id: 13, title_km: "កំណែវិញ្ញាសារត្រៀមប្របាក់ឌបឆ្នាំ ២០២២", youtube_id: "WPR8TYzxzsM", description_km: null },
  { id: 14, title_km: "ថ្នាក់ទី១២ គីមីវិទ្យា ការសំយោគអេស្ទែ", youtube_id: "Ft6KTOuS69U", description_km: null },
  { id: 15, title_km: "ថ្នាក់ទី១២ គណិតវិទ្យា គណនាអាំងតេក្រាល", youtube_id: "ES21NEdiDuQ", description_km: null },
];
