---
title: Rangkuman Luar Kepala - AWS Solutions Architect Associate
date: 2026-09-25 20:48:00
tags:
  - aws
  - certification
  - saa-c03
categories:
  - cloud
---

Saya baru saja lulus sertifikasi **[AWS Certified Solutions Architect – Associate (SAA-C03)](https://aws.amazon.com/id/certification/certified-solutions-architect-associate/)** untuk yang kedua kalinya, karena sertifikat AWS hanya berlaku 3 tahun dan sertifikat sebelumnya expired bulan ini, September 2026. Sebagai orang dengan latar belakang developer, jalur Solutions Architect terasa paling sulit bagi saya pribadi. Karena itu, saya susun catatan belajar ini dengan bahasa yang semoga mudah dipahami. Saya bagikan di sini agar tidak sekedar tersimpan sendiri — semoga menjadi amal jariyah & bermanfaat.

Beberapa catatan sebelum masuk ke materi:

- Ini catatan pribadi berbahasa Indonesia, bukan materi resmi AWS. Poin yang bersumber di luar catatan utama saya ditandai dengan simbol ⚠️.
- Formatnya sengaja padat dan banyak tabel perbandingan, karena sebagian besar soal SAA-C03 menguji kemampuan membedakan layanan yang mirip.
- Urutan prioritas (🔴 Tinggi, 🟠 Sedang, ⚪ Rendah) disusun berdasarkan pengalaman pribadi saya di ujian sesungguhnya.

Selamat belajar.

---

## 1. Networking & Content Delivery

### Amazon VPC 🔴 _Prioritas Tinggi_

CIDR block Amazon VPC berkisar antara /16 hingga /28, dan tidak dapat diubah setelah VPC dibuat. Setiap subnet hanya dapat berada di satu Availability Zone, dan AWS mereservasi lima alamat IP di setiap subnet untuk keperluan internal.

#### Security Group vs Network ACL

Ini adalah salah satu pasangan yang paling sering menjadi jebakan di ujian.

| Aspek                         | Security Group                                    | Network ACL                                                |
| ----------------------------- | ------------------------------------------------- | ---------------------------------------------------------- |
| Level operasi                 | Instance / ENI                                    | Subnet                                                     |
| Jenis rule                    | Hanya _allow_ (implicit deny di akhir)            | Mendukung _allow_ dan _deny_                               |
| Sifat                         | Stateful (traffic balik otomatis diizinkan)       | Stateless (traffic balik harus diizinkan secara eksplisit) |
| Evaluasi rule                 | Semua rule dievaluasi                             | Berurutan sesuai nomor rule, berhenti pada match pertama   |
| Cakupan                       | Harus diasosiasikan secara eksplisit per instance | Otomatis berlaku untuk seluruh instance dalam subnet       |
| Memblokir IP tertentu         | Tidak bisa                                        | Bisa — ini mekanisme yang tepat untuk kebutuhan tersebut   |
| Default pada konfigurasi baru | Deny semua inbound, allow semua outbound          | Deny semua hingga ditambahkan rule                         |

Jika sebuah soal menyebutkan "masalah konektivitas antar-subnet", kecurigaan pertama sebaiknya diarahkan ke Security Group atau Network ACL — bukan route table, karena _local route_ pada route table tidak dapat dihapus.

Beberapa poin tambahan seputar VPC:

- **NAT Gateway** bersifat _managed_, tersedia secara _highly available_ per Availability Zone, dengan bandwidth hingga 45 Gbps, namun tidak dapat difungsikan sebagai bastion host.
- **NAT Instance** bersifat _self-managed_, dapat difungsikan sebagai bastion host, tetapi wajib menonaktifkan fitur _source/destination check_.
- **VPC Peering** bersifat _one-to-one_ dan **tidak transitif** — CIDR pada kedua VPC tidak boleh saling tumpang tindih. Batas default adalah 50 koneksi peering, dengan maksimum hingga 125.
- **VPC Flow Logs** tidak dapat diberi tag maupun dikonfigurasi ulang setelah dibuat, dan tidak menangkap traffic DNS, DHCP, metadata instance, maupun Time Sync.

#### Memahami Keluarga "Gateway" dan VPC Endpoint

Salah satu sumber kebingungan terbesar di topik networking AWS adalah banyaknya istilah yang mengandung kata "Gateway". Prinsip dasarnya sederhana: **"Gateway" adalah pintu masuk/keluar VPC**, sedangkan **"Endpoint" adalah jalur privat menuju satu layanan AWS tertentu**.

| Nama                                     | Fungsi                                                                                               | Cakupan                                                     |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **Internet Gateway (IGW)**               | Pintu penghubung dua arah antara VPC dengan internet publik                                          | Untuk subnet publik                                         |
| **NAT Gateway**                          | Memungkinkan instance di private subnet mengakses internet secara _outbound_ saja                    | Ditempatkan di public subnet, digunakan oleh private subnet |
| **Egress-only Internet Gateway**         | Setara NAT Gateway, khusus untuk IPv6 (stateful, outbound-only)                                      | Untuk subnet dengan IPv6                                    |
| **Virtual Private Gateway (VGW)**        | Sisi AWS dari koneksi Site-to-Site VPN atau Direct Connect                                           | Umumnya satu VGW per VPC                                    |
| **Customer Gateway (CGW)**               | Sisi on-premises dari koneksi VPN, merepresentasikan router/firewall pelanggan                       | Pasangan dari VGW                                           |
| **Transit Gateway (TGW)**                | Hub pusat untuk menghubungkan banyak VPC dan on-premises sekaligus, cukup satu attachment per VPC    | Lintas VPC, dapat lintas region                             |
| **Direct Connect Gateway**               | Menghubungkan satu koneksi Direct Connect ke banyak VPC di region berbeda                            | Khusus konteks Direct Connect                               |
| **VPC Gateway Endpoint**                 | Jalur privat khusus menuju S3 dan DynamoDB, tanpa biaya tambahan, tanpa memerlukan internet atau NAT | Hanya untuk dua layanan tersebut                            |
| **VPC Interface Endpoint (PrivateLink)** | Jalur privat menuju hampir seluruh layanan AWS lainnya melalui ENI, dikenakan biaya                  | Sebagian besar layanan AWS lainnya                          |

Cara paling cepat membedakannya dalam soal: jika kebutuhannya adalah mengakses S3 atau DynamoDB tanpa melalui internet dan tanpa biaya tambahan, jawabannya adalah **Gateway Endpoint**. Jika kebutuhannya mengakses layanan AWS lain (di luar S3/DynamoDB) tanpa internet, jawabannya adalah **Interface Endpoint/PrivateLink**. Jika kebutuhannya menghubungkan banyak VPC sekaligus tanpa membangun peering satu per satu, jawabannya adalah **Transit Gateway**. Jika kebutuhannya adalah sisi AWS dari sebuah koneksi VPN/Direct Connect, jawabannya adalah **Virtual Private Gateway**.

### Elastic Load Balancing (ELB) 🔴 _Prioritas Tinggi_

| Jenis                               | Layer                 | Karakteristik                                                                                         |
| ----------------------------------- | --------------------- | ----------------------------------------------------------------------------------------------------- |
| **Application Load Balancer (ALB)** | Layer 7 (HTTP/HTTPS)  | Mendukung host/path-based routing, paling fleksibel untuk aplikasi web                                |
| **Network Load Balancer (NLB)**     | Layer 4 (TCP/UDP/TLS) | IP statis per Availability Zone, performa sangat tinggi (jutaan request/detik), latency sangat rendah |
| **Gateway Load Balancer**           | Layer 3/4             | Menyisipkan virtual appliance pihak ketiga (firewall, IDS) secara transparan di jalur traffic         |
| **Classic Load Balancer (CLB)**     | Layer 4/7 terbatas    | Layanan lama (_legacy_), sebaiknya dihindari untuk kebutuhan baru                                     |

Beberapa poin penting lainnya:

- _Cross-zone load balancing_ secara default **aktif** pada ALB, namun secara default **nonaktif** pada NLB — ini merupakan jebakan klasik yang cukup sering muncul.
- ELB tidak mendukung autentikasi client certificate, berbeda dengan API Gateway.
- Mekanisme _health check_ pada ELB bersifat "fail open": apabila seluruh target pada satu Availability Zone berstatus _unhealthy_, traffic tetap akan dikirimkan ke seluruh target tersebut.
- **Listener** adalah konfigurasi port dan protokol yang "didengarkan" oleh ELB dari sisi client (misalnya port 443 untuk HTTPS). Setiap listener memiliki _rule_ yang menentukan target group tujuan — pada ALB, rule dapat dibuat berdasarkan host header maupun path.

### Amazon Route 53 🔴 _Prioritas Tinggi_

_Alias record_ bersifat gratis, dapat digunakan pada zone apex, namun hanya dapat diarahkan ke resource AWS tertentu. Sebaliknya, CNAME dikenakan biaya dan tidak dapat digunakan pada zone apex.

#### Tujuh Jenis Routing Policy

| Routing Policy   | Kapan Digunakan                                                                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Simple**       | Satu resource, tanpa health check                                                                                                                 |
| **Weighted**     | Distribusi traffic berdasarkan persentase, misalnya untuk A/B testing atau canary release                                                         |
| **Latency**      | Mengarahkan user ke region dengan latency terendah                                                                                                |
| **Failover**     | Konfigurasi primary/secondary — otomatis beralih ke secondary saat primary _unhealthy_, umum digunakan pada skenario disaster recovery            |
| **Geolocation**  | Routing berdasarkan lokasi geografis user, untuk kebutuhan compliance atau lokalisasi konten                                                      |
| **Geoproximity** | Serupa dengan Geolocation, namun memungkinkan penyesuaian _bias_ untuk menggeser proporsi traffic antar region — memerlukan Route 53 Traffic Flow |
| **Multivalue**   | Mengembalikan hingga delapan record sekaligus disertai health check — bukan pengganti load balancer sesungguhnya                                  |

_Private hosted zone_ memerlukan atribut `enableDnsHostname` dan `enableDnsSupport` bernilai _true_, dan tidak melakukan registrasi otomatis terhadap instance EC2.

### Amazon CloudFront 🔴 _Prioritas Tinggi_

Hanya request GET dan HEAD yang di-_cache_; request lain seperti PUT/POST diteruskan langsung ke origin. Origin Access Identity (OAI) membatasi akses langsung ke origin S3. Signed URL digunakan untuk satu file, sedangkan Signed Cookie digunakan untuk banyak file sekaligus.

Pengaturan _geo-restriction_ hanya dapat memilih salah satu antara _blacklist_ atau _whitelist_, tidak keduanya. Proses _invalidation_ tidak dapat dibatalkan dan dikenakan biaya. Sebelum sebuah distribusi dapat dihapus, distribusi tersebut harus dinonaktifkan terlebih dahulu, yang memerlukan waktu sekitar 15 menit. Lambda@Edge memiliki empat titik eksekusi, yaitu pada _viewer request/response_ dan _origin request/response_.

### AWS Global Accelerator 🔴 _Prioritas Tinggi_

Layanan ini menyediakan dua alamat IP anycast statis yang tetap, bahkan ketika layanan dinonaktifkan. Health check mendukung protokol TCP, HTTP, dan HTTPS, namun tidak mendukung UDP, dengan waktu failover di bawah satu menit. Global Accelerator paling sesuai untuk traffic TCP/UDP non-HTTP — seperti gaming atau VoIP — yang membutuhkan IP statis, berbeda dengan CloudFront yang bekerja pada layer DNS dan caching konten.

### AWS Direct Connect 🟠 _Prioritas Sedang_

Direct Connect merupakan koneksi _dedicated_ menuju backbone AWS yang **tidak terenkripsi secara default**, dengan pilihan kecepatan port 1, 10, atau 100 Gbps.

| Virtual Interface (VIF) | Tujuan                                                       |
| ----------------------- | ------------------------------------------------------------ |
| **Public VIF**          | Mengakses layanan publik AWS (misalnya S3) melalui IP publik |
| **Private VIF**         | Mengakses satu VPC secara langsung melalui IP privat         |
| **Transit VIF**         | Mengakses banyak VPC sekaligus melalui Transit Gateway       |

Untuk mencapai _high availability_, dibutuhkan koneksi Direct Connect kedua atau VPN sebagai _backup_.

### AWS Site-to-Site VPN 🟠 _Prioritas Sedang_

Koneksi ini menggunakan IPsec melalui jaringan internet publik, menghubungkan Virtual Private Gateway (sisi AWS) dengan Customer Gateway (sisi on-premises), dan secara otomatis menyediakan dua tunnel. Routing dapat dikonfigurasi secara statis atau dinamis melalui BGP — BGP lebih disarankan karena memberikan resiliency yang lebih baik.

### AWS Transit Gateway 🟠 _Prioritas Sedang_

Transit Gateway menerapkan arsitektur _hub-and-spoke_ untuk menghubungkan banyak VPC, cukup dengan satu attachment per VPC — berbeda dengan VPC Peering yang bersifat _peer-to-peer_. CIDR pada VPC yang terhubung tidak boleh saling tumpang tindih, dan Transit Gateway mendukung peering antar region.

### VPC Flow Logs 🟠 _Prioritas Sedang_

Dapat diaktifkan pada level VPC, subnet, maupun ENI, dan dikirimkan ke CloudWatch Logs. Flow Logs tidak dapat diberi tag, tidak dapat dikonfigurasi ulang (harus dihapus dan dibuat kembali), serta tidak menangkap traffic Route 53, DHCP, metadata instance, Time Sync, maupun lisensi Windows.

### Amazon API Gateway ⚪ _Prioritas Rendah_

Endpoint wajib menggunakan HTTPS. Terdapat tiga tipe endpoint: Edge-Optimized, Regional, dan Private. Batas throttle default adalah 10.000 request/detik dengan 5.000 concurrent request — melebihi batas ini akan menghasilkan HTTP 429. Integrasi AWS_PROXY (menuju Lambda) merupakan yang paling umum digunakan, sementara integrasi MOCK digunakan untuk pengujian tanpa backend. Autentikasi dapat menggunakan IAM policy, Lambda authorizer, atau Cognito User Pools.

---

## 2. Storage

### Amazon S3 🔴 _Prioritas Tinggi_

#### Storage Class

| Storage Class                  | Durasi Minimum               | Waktu Retrieval             | Kapan Digunakan                                                                                             |
| ------------------------------ | ---------------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Standard**                   | Tidak ada                    | Instan                      | Data yang sering diakses                                                                                    |
| **Intelligent-Tiering**        | Tidak ada                    | Instan                      | Pola akses tidak dapat diprediksi — perpindahan tier dilakukan otomatis                                     |
| **Standard-IA**                | 30 hari, minimum 128KB/objek | Instan                      | Jarang diakses namun membutuhkan akses cepat sewaktu-waktu                                                  |
| **One Zone-IA**                | 30 hari, minimum 128KB/objek | Instan                      | Serupa Standard-IA namun hanya disimpan pada satu Availability Zone (lebih murah, durabilitas lebih rendah) |
| **Glacier Instant Retrieval**  | 90 hari                      | Instan (hitungan milidetik) | Arsip yang jarang diakses namun sesekali membutuhkan akses instan                                           |
| **Glacier Flexible Retrieval** | 90 hari                      | Hitungan menit hingga jam   | Arsip dengan waktu retrieval yang masih relatif cepat                                                       |
| **Glacier Deep Archive**       | 180 hari                     | Hingga 12 jam               | Arsip jangka sangat panjang, paling murah, waktu retrieval paling lambat                                    |

Beberapa karakteristik penting S3 lainnya:

- Model konsistensi _read-after-write_ berlaku untuk objek baru (PUT), sementara _eventual consistency_ berlaku pada operasi overwrite atau delete.
- _Versioning_, setelah diaktifkan, tidak dapat dinonaktifkan sepenuhnya — hanya dapat disuspensi. Cross-Region Replication mewajibkan versioning aktif di kedua bucket.
- _Multipart upload_ diwajibkan untuk objek berukuran di atas 5GB. Batas default adalah 100 bucket per akun.
- **S3 Event Notification** memicu aksi otomatis (Lambda, SQS, atau SNS) ketika terjadi event pada bucket, tanpa memerlukan polling manual. Untuk kebutuhan routing yang lebih kompleks, notifikasi dapat diarahkan terlebih dahulu ke **EventBridge**.
- **S3 Transfer Acceleration** mempercepat transfer data jarak jauh — baik unggah maupun unduh — dengan memanfaatkan CloudFront Edge Locations. Sebagian besar skenario soal berfokus pada proses unggah data berukuran besar dari lokasi yang jauh, meski proses unduh turut dipercepat.
- **S3 Object Lock** ⚠️ menerapkan mekanisme WORM (_Write Once Read Many_) yang mencegah objek dihapus atau ditimpa hingga periode tertentu terlampaui, dengan dua mode: _Governance_ (masih dapat di-_override_ oleh user tertentu) dan _Compliance_ (tidak dapat diubah oleh siapa pun, termasuk root user). _(Topik ini tidak dibahas pada cheat sheet Neal Davis, dan ditambahkan berdasarkan dokumentasi resmi AWS.)_

#### Jenis Enkripsi S3

| Jenis                      | Pemegang Key Enkripsi                                                | Karakteristik                                                                                                                      |
| -------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **SSE-S3**                 | AWS (key unik per objek)                                             | Metode default, tanpa biaya tambahan, menggunakan AES-256, key dirotasi otomatis oleh AWS                                          |
| **SSE-KMS**                | AWS KMS (Customer Master Key)                                        | Menyediakan audit trail melalui CloudTrail, permission dapat diatur terpisah melalui key policy — dikenakan biaya tambahan         |
| **SSE-C**                  | Customer (key dikirimkan langsung oleh pengguna pada setiap request) | AWS hanya memproses enkripsi tanpa menyimpan key — kehilangan key berarti kehilangan akses data secara permanen                    |
| **Client-Side Encryption** | Customer (enkripsi dilakukan sebelum data dikirim ke S3)             | S3 hanya menyimpan data yang sudah terenkripsi sebelumnya, baik menggunakan CMK dari KMS maupun key yang dikelola aplikasi sendiri |

Cara mudah membedakannya: awalan "SSE" berarti _Server-Side Encryption_, di mana proses enkripsi dilakukan oleh S3. Selain itu, khusus pada SSE-C dan Client-Side Encryption, AWS **sama sekali tidak menyimpan key** milik pengguna.

### Amazon EBS 🔴 _Prioritas Tinggi_

#### Jenis Volume

| Jenis       | Tipe                                    | IOPS Maksimum | Karakteristik                                                                                                                                                             |
| ----------- | --------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **gp2**     | SSD, general purpose                    | 16.000        | IOPS mengikuti ukuran volume (3 IOPS/GB), dapat _burst_ menggunakan credit                                                                                                |
| **gp3**     | SSD, general purpose (generasi terbaru) | 16.000        | Baseline IOPS (3.000) dan throughput (125 MiB/s) bersifat tetap, tidak bergantung pada ukuran volume — dapat ditingkatkan secara independen dan lebih murah dibanding gp2 |
| **io1/io2** | SSD, provisioned IOPS                   | 64.000        | Ditujukan untuk kebutuhan IOPS tinggi dan konsisten (misalnya database besar), mendukung _Multi-Attach_                                                                   |
| **st1**     | HDD, throughput optimized               | —             | Untuk big data/log processing, biaya rendah, tidak dapat digunakan sebagai boot volume                                                                                    |
| **sc1**     | HDD, cold storage                       | —             | Untuk data yang jarang diakses, biaya paling rendah, tidak dapat digunakan sebagai boot volume                                                                            |

Peralihan dari gp2 ke gp3 pada dasarnya merupakan peningkatan yang menawarkan performa lebih terjamin dengan biaya lebih rendah. Ketika sebuah soal menyebutkan kebutuhan "performa lebih baik dengan biaya lebih rendah", jawaban yang tepat hampir selalu **gp3**, bukan io1/io2.

Volume EBS bersifat spesifik terhadap satu Availability Zone, sementara snapshot bersifat spesifik terhadap region (disimpan di S3 secara incremental). Instance Store bersifat non-persistent dan mengharuskan instance tetap berjalan, sedangkan EBS bersifat persistent dan mendukung instance yang dihentikan sementara (_stop_).

### Amazon EFS 🔴 _Prioritas Tinggi_

EFS menggunakan protokol NFS, mendukung akses multi-AZ, dan dapat diakses oleh ribuan instance EC2 secara bersamaan — berbeda dengan EBS yang hanya dapat digunakan satu instance dalam satu waktu. Terdapat dua performance mode (General Purpose dan Max I/O) serta dua throughput mode (Bursting dan Provisioned). Enkripsi at-rest harus diaktifkan sejak filesystem pertama kali dibuat, dan tidak dapat ditambahkan kemudian.

### Amazon FSx 🔴 _Prioritas Tinggi_

| Jenis                   | Protokol               | Kapan Digunakan                                                                                  |
| ----------------------- | ---------------------- | ------------------------------------------------------------------------------------------------ |
| **Windows File Server** | SMB + Active Directory | Aplikasi berbasis Windows yang membutuhkan shared file storage native                            |
| **Lustre — Scratch**    | POSIX, HPC             | Komputasi HPC/ML bersifat sementara, tanpa high availability                                     |
| **Lustre — Persistent** | POSIX, HPC             | Komputasi HPC/ML jangka panjang, high availability pada single-AZ, terintegrasi native dengan S3 |

### AWS Storage Gateway 🔴 _Prioritas Tinggi_

Storage Gateway merupakan solusi hybrid: aplikasi atau infrastruktur di lingkungan on-premises tidak perlu diubah sama sekali — sistem tetap "mengira" sedang berkomunikasi dengan storage lokal biasa — sementara di baliknya, data sesungguhnya disimpan di Amazon S3, dengan penyimpanan cache lokal untuk data yang sering diakses.

| Jenis Gateway               | Interface                  | Karakteristik                                                              |
| --------------------------- | -------------------------- | -------------------------------------------------------------------------- |
| **File Gateway**            | NFS/SMB menuju S3          | Ukuran file maksimum 5TB, diakses layaknya file share biasa                |
| **Volume Gateway — Cached** | iSCSI                      | Data utama disimpan di S3, cache lokal untuk data yang sering diakses      |
| **Volume Gateway — Stored** | iSCSI                      | Data utama tetap di on-premises, S3 digunakan untuk backup secara asinkron |
| **Tape Gateway**            | Virtual Tape Library (VTL) | Pengganti tape fisik untuk software backup seperti NetBackup atau Veeam    |

Satu gateway hanya dapat menjalankan satu jenis interface dalam satu waktu, dan tidak dapat dicampur.

### AWS DataSync 🔴 _Prioritas Tinggi_

DataSync melakukan transfer data secara online melalui jaringan — berbeda dengan Snow Family yang melakukan transfer secara fisik. Layanan ini memerlukan DataSync Agent (berbentuk virtual machine) di lingkungan on-premises, dengan tujuan transfer berupa S3 (seluruh storage class), EFS, atau FSx for Windows File Server.

### AWS Snow Family 🟠 _Prioritas Sedang_

| Anggota             | Skala                | Karakteristik                                                                   |
| ------------------- | -------------------- | ------------------------------------------------------------------------------- |
| **Snowcone**        | Puluhan TB           | Perangkat edge terkecil dan portable, dapat pula digunakan untuk edge computing |
| **Snowball (Edge)** | Ratusan TB hingga PB | Transfer fisik dalam jumlah besar, enkripsi menggunakan KMS                     |
| **Snowmobile**      | Hingga 100PB         | Berbentuk truk kontainer, untuk migrasi data center berskala eksabyte           |

Snow Family dipilih ketimbang DataSync ketika bandwidth jaringan yang tersedia tidak memadai untuk volume data yang sangat besar dalam batas waktu yang ditentukan.

### AWS Backup 🟠 _Prioritas Sedang_

Menyediakan backup terpusat untuk EC2, EBS, EFS, FSx, S3, RDS, DynamoDB, dan Storage Gateway. Fitur _Vault Lock_ mencegah penghapusan atau modifikasi backup, dan terintegrasi dengan AWS Organizations untuk kebutuhan multi-akun.

---

## 3. Security, Identity & Compliance

### AWS IAM 🔴 _Prioritas Tinggi_

Urutan evaluasi policy pada IAM: seluruh request bersifat _implicit deny_ secara default, kemudian _explicit allow_ dapat membatalkannya, namun tetap dibatasi oleh permission boundary, SCP, dan session policy — dan _explicit deny_ di lapisan mana pun akan selalu menang. Perlu diperhatikan bahwa hasil akhir permission merupakan **irisan (intersection)**, bukan gabungan (union), dari seluruh policy yang berlaku.

#### Membedakan Konsep-Konsep IAM

Salah satu bagian yang paling sering membingungkan adalah perbedaan istilah-istilah dalam IAM. Berikut rangkumannya:

| Konsep                           | Definisi                                                                                                         | Poin Penting                                                                                                                             |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **IAM User**                     | Identitas untuk satu individu atau aplikasi, memiliki kredensial permanen (password dan/atau access key)         | Maksimum dua access key aktif per user; maksimum 5.000 user per akun                                                                     |
| **IAM Group**                    | Kumpulan IAM User untuk memudahkan pemberian permission secara massal                                            | Bukan merupakan _principal_ — tidak dapat menjadi subjek dalam sebuah policy; tidak dapat bersifat nested                                |
| **IAM Role**                     | Identitas tanpa kredensial permanen, digunakan ("_assumed_") secara sementara oleh user, service, atau akun lain | Tidak memiliki password atau access key sendiri; satu instance EC2 hanya dapat menggunakan satu role dalam satu waktu                    |
| **IAM Policy (identity-based)**  | Dokumen JSON berisi izin yang dilekatkan pada User, Group, atau Role                                             | Terdapat tiga jenis: AWS Managed, Customer Managed, dan Inline                                                                           |
| **Resource-based Policy**        | Policy yang dilekatkan langsung pada resource, bukan pada identitas — misalnya S3 bucket policy                  | Umum digunakan untuk kebutuhan cross-account access tanpa proses _assume role_                                                           |
| **Trust Policy**                 | Bagian dari IAM Role yang menentukan **siapa** yang diizinkan melakukan _assume_ terhadap role tersebut          | Berbeda dari _permissions policy_ yang menentukan **apa** yang boleh dilakukan oleh role; wildcard tidak diperbolehkan sebagai principal |
| **Permission Boundary**          | Batas maksimum permission untuk satu identitas tertentu                                                          | Tidak memberikan izin secara langsung, hanya membatasi izin yang sudah ada                                                               |
| **Service Control Policy (SCP)** | Batas maksimum permission pada level akun atau Organizational Unit                                               | Serupa dengan permission boundary, namun berlaku di level akun; tidak berlaku pada management account                                    |

Cara paling praktis membedakan Role dengan User: apabila sebuah soal menyebutkan istilah "_temporary credentials_", "_assume_", "_cross-account access_", atau "aplikasi pada EC2/Lambda membutuhkan akses ke layanan AWS lain", jawaban yang tepat adalah **IAM Role**, bukan IAM User atau access key. Sementara itu, cara membedakan Trust Policy dengan Permissions Policy: Trust Policy menjawab pertanyaan "siapa yang boleh menggunakan role ini", sedangkan Permissions Policy menjawab "apa yang boleh dilakukan oleh role ini".

### AWS Organizations 🔴 _Prioritas Tinggi_

Service Control Policy (SCP) berfungsi sebagai _guardrail_ atau pembatas maksimum, dan **tidak pernah memberikan izin** secara mandiri — hasil akhir permission tetap merupakan irisan antara SCP dan IAM policy. SCP tidak berlaku pada management account maupun service-linked role. Batas default untuk _consolidated billing_ adalah 20 akun tertaut.

### IAM Identity Center (AWS SSO) 🔴 _Prioritas Tinggi_

Menyediakan single sign-on terpusat lintas berbagai akun dalam Organizations, termasuk aplikasi SaaS pihak ketiga melalui SAML 2.0, tanpa perlu membuat IAM user terpisah pada setiap akun.

### AWS KMS 🔴 _Prioritas Tinggi_

Enkripsi langsung dibatasi hingga 4KB, sehingga digunakan pendekatan _Envelope Encryption_: KMS mengenkripsi _Data Encryption Key_ (DEK), yang kemudian digunakan untuk mengenkripsi data sesungguhnya. DEK tidak pernah disimpan oleh KMS.

| Jenis Key                | Biaya    | Kontrol Rotasi/Policy                                                                     |
| ------------------------ | -------- | ----------------------------------------------------------------------------------------- |
| **AWS Managed Key**      | Gratis   | Sepenuhnya dikelola oleh AWS                                                              |
| **Customer Managed Key** | Berbayar | Kontrol penuh atas rotasi, policy, dan penonaktifan oleh pengguna                         |
| **AWS Owned Key**        | Gratis   | Tidak terlihat maupun dikelola oleh pelanggan, digunakan secara internal oleh layanan AWS |

Key bersifat regional. Proses penghapusan key memerlukan masa tunggu 7 hingga 30 hari. Akses non-root memerlukan key policy dan IAM policy secara bersamaan.

### AWS CloudTrail 🔴 _Prioritas Tinggi_

CloudTrail aktif secara otomatis sejak sebuah akun AWS dibuat, menyediakan riwayat _Event History_ selama 90 hari melalui console/API tanpa memerlukan konfigurasi tambahan — namun pada kondisi ini belum ada tujuan ekspor mana pun. Ketika sebuah Trail dibuat, tujuan wajibnya adalah **Amazon S3 bucket**; secara opsional, log juga dapat dikirimkan ke CloudWatch Logs untuk mendukung _alarming_ secara real-time. CloudTrail merekam "siapa melakukan API call apa", sedangkan CloudWatch merekam "bagaimana performa sistem" — keduanya kerap dianggap serupa meski fungsinya berbeda.

### Amazon Cognito 🟠 _Prioritas Sedang_

User Pools berfungsi untuk autentikasi (menyerupai IAM User), menghasilkan JWT. Identity Pools berfungsi untuk otorisasi (menyerupai IAM Role), menghasilkan kredensial AWS sementara melalui STS.

### AWS WAF & Shield 🟠 _Prioritas Sedang_

WAF beroperasi pada layer 7, memfilter serangan seperti SQL injection dan XSS, terintegrasi dengan CloudFront maupun ALB. Shield beroperasi pada layer 3/4, menangani serangan DDoS volumetrik. Shield Standard tersedia gratis dan otomatis untuk seluruh akun, sedangkan Shield Advanced berbayar dan mencakup akses ke DDoS Response Team (DRT) selama 24/7.

### AWS Config 🟠 _Prioritas Sedang_

Merekam snapshot konfigurasi resource beserta pemeriksaan kepatuhan (Config Rules) — berbeda dari CloudTrail yang berfokus pada audit API call.

### AWS Secrets Manager 🟠 _Prioritas Sedang_

Menyediakan rotasi kredensial otomatis untuk RDS, Redshift, dan DocumentDB (berbayar), berbeda dengan SSM Parameter Store yang tidak memiliki rotasi native namun tersedia secara gratis pada tier standar dan mendukung struktur hierarkis.

### Beberapa Layanan Keamanan Tambahan ⚪ _Prioritas Rendah_

- **AWS Resource Access Manager (RAM)**: berbagi resource (subnet, Transit Gateway, License Manager) lintas akun tanpa duplikasi.
- **Amazon Macie** ⚠️: layanan machine learning yang secara otomatis menemukan dan melindungi data sensitif (PII, data finansial) yang tersimpan di S3. _(Tidak dibahas pada cheat sheet Neal Davis, ditambahkan dari dokumentasi AWS.)_
- **AWS Security Hub** ⚠️: dashboard terpusat yang mengagregasi temuan dari GuardDuty, Inspector, Macie, dan Config — bukan mesin deteksi tersendiri. _(Ditambahkan dari dokumentasi AWS.)_
- **AWS Firewall Manager** ⚠️: mengelola rule WAF, Shield Advanced, dan Security Group secara terpusat di seluruh akun dalam Organizations. _(Ditambahkan dari dokumentasi AWS.)_
- **AWS CloudHSM**: hardware security module _single-tenant_ yang memenuhi standar FIPS 140-2 Level 3, berbeda dengan KMS yang bersifat _multi-tenant_ dan terkelola sepenuhnya oleh AWS.
- **AWS Certificate Manager (ACM)**: sertifikat SSL/TLS gratis dengan perpanjangan otomatis, namun hanya berlaku untuk resource AWS yang terintegrasi (ELB, CloudFront) — private key tidak dapat diunduh.
- **AWS GuardDuty**: mendeteksi ancaman berdasarkan analisis CloudTrail, VPC Flow Logs, dan DNS logs.
- **AWS Trusted Advisor**: menyediakan pemeriksaan berdasarkan lima kategori; tier gratis hanya mencakup tujuh pemeriksaan inti.
- **Amazon Inspector**: melakukan penilaian kerentanan (vulnerability/CVE assessment) terhadap resource yang sedang berjalan.
- **AWS Directory Service**: tersedia dalam tiga varian — AWS Managed Microsoft AD (Active Directory penuh), Simple AD (berbasis Samba, murah, kapasitas terbatas), dan AD Connector (proxy menuju Active Directory on-premises tanpa duplikasi user).

#### Merangkum Keluarga Layanan Keamanan & Kepatuhan

| Layanan             | Fungsi Utama                                              | Kapan Aktif                           |
| ------------------- | --------------------------------------------------------- | ------------------------------------- |
| **WAF**             | Memfilter serangan layer 7 pada traffic HTTP/HTTPS        | Memerlukan konfigurasi manual         |
| **Shield Standard** | Proteksi DDoS layer 3/4                                   | Aktif otomatis dan gratis             |
| **Shield Advanced** | Proteksi DDoS tingkat lanjut, termasuk akses DRT          | Berbayar, memerlukan subscription     |
| **GuardDuty**       | Deteksi ancaman berdasarkan analisis log secara real-time | Perlu diaktifkan, tanpa agent         |
| **Inspector**       | Penilaian kerentanan pada resource yang sudah berjalan    | Perlu diaktifkan, pemeriksaan berkala |
| **Trusted Advisor** | Rekomendasi praktik terbaik secara umum                   | Tier gratis terbatas                  |
| **Config**          | Snapshot dan kepatuhan konfigurasi resource               | Perlu diaktifkan                      |
| **CloudTrail**      | Audit aktivitas API                                       | Aktif otomatis                        |

Secara konseptual: WAF dan Shield bersifat **preventif**, mencegah serangan sebelum mencapai sistem. GuardDuty dan Inspector bersifat **detektif**, mengidentifikasi masalah setelah atau selama sistem berjalan. Trusted Advisor memberikan rekomendasi umum, bukan proteksi maupun deteksi ancaman yang spesifik.

---

## 4. Compute

### Amazon EC2 🔴 _Prioritas Tinggi_

#### Purchasing Options

Topik ini merupakan salah satu yang paling sering diujikan, biasanya dalam konteks skenario "solusi paling hemat biaya".

| Opsi                                | Komitmen                 | Diskon                                 | Karakteristik                                                                                 |
| ----------------------------------- | ------------------------ | -------------------------------------- | --------------------------------------------------------------------------------------------- |
| **On-Demand**                       | Tidak ada                | Tidak ada                              | Dibayar per jam/detik, paling fleksibel                                                       |
| **Spot Instance**                   | Tidak ada                | Hingga 90%                             | Dapat diinterupsi (notifikasi dua menit sebelumnya), cocok untuk workload yang fault-tolerant |
| **Reserved Instance — Standard**    | 1 atau 3 tahun           | 40–60%                                 | Dapat mengubah AZ/ukuran, namun tidak dapat mengubah instance family                          |
| **Reserved Instance — Convertible** | 1 atau 3 tahun           | 31–54%                                 | Dapat ditukar ke instance family, OS, atau tenancy lain                                       |
| **Reserved Instance — Scheduled**   | 1 tahun, jadwal berulang | —                                      | Untuk kebutuhan yang dapat diprediksi namun tidak berjalan 24/7                               |
| **Savings Plan — Compute** ⚠️       | 1 atau 3 tahun           | Hingga 66%                             | Paling fleksibel — berlaku lintas instance family, region, OS, bahkan hingga Fargate/Lambda   |
| **Savings Plan — EC2 Instance** ⚠️  | 1 atau 3 tahun           | Lebih tinggi dari Compute Savings Plan | Terikat pada satu instance family di satu region                                              |
| **Dedicated Host**                  | Opsional                 | —                                      | Server fisik eksklusif dengan kontrol penuh atas socket/core/host ID                          |
| **Dedicated Instance**              | Tidak ada                | —                                      | Tenancy eksklusif namun tetap tervirtualisasi                                                 |

_(Topik Savings Plans tidak dibahas secara eksplisit pada cheat sheet Neal Davis, dan ditambahkan berdasarkan dokumentasi resmi AWS mengingat topik ini cukup sering muncul dalam soal terkait optimasi biaya.)_

Sebagai panduan umum: workload yang fleksibel dan dapat diinterupsi paling sesuai menggunakan Spot Instance. Workload yang stabil dalam jangka panjang namun berpotensi berpindah instance family atau region lebih sesuai menggunakan Compute Savings Plan. Sementara workload yang stabil dengan instance family yang sudah pasti tidak berubah dapat memanfaatkan Reserved Instance atau EC2 Instance Savings Plan untuk mendapatkan diskon yang lebih besar.

Beberapa poin tambahan: Placement Group tersedia dalam tiga jenis — Cluster (satu AZ, latency rendah), Spread (lintas AZ), dan Partition (rack terpisah). Elastic IP tersedia lima per region secara default; alamat IP publik akan hilang saat instance dihentikan, sementara Elastic IP tetap.

### Amazon EC2 Auto Scaling 🔴 _Prioritas Tinggi_

| Launch Template vs Configuration | Karakteristik                                                                                             |
| -------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Launch Template**              | Mendukung _versioning_, dapat diperbarui tanpa membuat konfigurasi baru — direkomendasikan                |
| **Launch Configuration**         | Bersifat _immutable_, harus dibuat ulang setiap kali terdapat perubahan — sudah tergolong lama (_legacy_) |

| Scaling Policy      | Cara Kerja                                                                                                                              |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Target Tracking** | Menetapkan target metric tertentu, Auto Scaling Group menyesuaikan jumlah instance secara otomatis — direkomendasikan, paling sederhana |
| **Step Scaling**    | Penyesuaian bertahap berdasarkan besarnya pelanggaran terhadap alarm threshold                                                          |
| **Simple Scaling**  | Satu aksi scaling per alarm, harus menunggu masa _cooldown_ sebelum aksi berikutnya                                                     |

### Amazon ECS, AWS Fargate, dan Amazon EKS 🔴 _Prioritas Tinggi_

|                              | ECS                                  | EKS                                  | Fargate                                     |
| ---------------------------- | ------------------------------------ | ------------------------------------ | ------------------------------------------- |
| Orchestrator                 | Proprietary AWS (istilah "Task")     | Kubernetes (istilah "Pod")           | Bukan orchestrator — merupakan mode compute |
| Launch type                  | EC2 atau Fargate                     | EC2 atau Fargate                     | —                                           |
| Kontrol level OS             | Ya, pada launch type EC2             | Ya, pada launch type EC2             | Tidak ada (serverless)                      |
| Kompatibilitas multi-cloud   | Tidak, bersifat proprietary AWS      | Ya, mengikuti standar Kubernetes     | —                                           |
| Perlu mengelola EC2/patching | Ya, jika menggunakan launch type EC2 | Ya, jika menggunakan launch type EC2 | Tidak diperlukan sama sekali                |

Perlu dipahami bahwa Fargate bukan pesaing dari ECS maupun EKS, melainkan merupakan pilihan _launch type_ di dalam keduanya — alternatif dari launch type EC2 yang membebaskan pengguna dari kebutuhan mengelola infrastruktur secara langsung.

### AWS Lambda 🟠 _Prioritas Sedang_

Alokasi memory berkisar antara 128MB hingga 10.240MB, dengan timeout maksimum 900 detik. Terdapat dua mode invoke: _synchronous_ (menunggu hasil) dan _asynchronous_ (retry dua kali, kemudian diarahkan ke DLQ/Destination). Reserved Concurrency menjamin kapasitas eksekusi, sedangkan Provisioned Concurrency menjaga fungsi tetap "hangat" untuk menghindari _cold start_.

Lambda sebaiknya **dihindari** ketika sebuah soal menyebutkan kebutuhan _long-running task_ yang berat (lebih dari 15 menit, batch processing, atau video encoding berskala besar) — dalam kasus tersebut, EC2, ECS, Fargate, atau AWS Batch lebih sesuai. Sebaliknya, Lambda **paling sesuai** ketika soal menyebutkan microservices, fungsi berdurasi pendek, atau trigger berbasis event (S3, API Gateway, EventBridge).

### AWS Batch 🟠 _Prioritas Sedang_ ⚠️

_(Layanan ini tidak dibahas pada cheat sheet Neal Davis, ditambahkan berdasarkan dokumentasi AWS karena cukup sering muncul sebagai jawaban yang tepat dalam soal-soal latihan.)_

AWS Batch merupakan layanan _managed batch computing_ yang memungkinkan eksekusi ratusan hingga ribuan job komputasi tanpa perlu mengelola cluster atau scheduler secara manual — kapasitas compute (EC2 atau Fargate) disediakan secara otomatis sesuai kebutuhan job, kemudian dihentikan setelah selesai. Layanan ini paling sesuai untuk job komputasi berat berdurasi lama yang perlu dimulai kembali dari awal apabila terinterupsi.

### AWS Elastic Beanstalk ⚪ _Prioritas Rendah_

| Deployment Policy                 | Downtime                                                                  | Rollback                 |
| --------------------------------- | ------------------------------------------------------------------------- | ------------------------ |
| **All at Once**                   | Ada                                                                       | Sulit dilakukan          |
| **Rolling**                       | Tidak ada, kapasitas berkurang sementara                                  | Manual, per batch        |
| **Rolling with additional batch** | Tidak ada, kapasitas tetap terjaga                                        | Manual                   |
| **Immutable**                     | Tidak ada — instance baru dibuat penuh sebelum di-_swap_                  | Paling aman              |
| **Blue/Green**                    | Tidak ada — environment baru dibuat penuh, kemudian di-_swap_ melalui DNS | Paling aman dan tercepat |

---

## 5. Database

### Amazon RDS 🔴 _Prioritas Tinggi_

Mendukung enam engine (Aurora, MySQL, MariaDB, Oracle, SQL Server, PostgreSQL) dengan kapasitas maksimum 64TiB (16TiB untuk SQL Server).

| Aspek           | Multi-AZ                                             | Read Replica                           |
| --------------- | ---------------------------------------------------- | -------------------------------------- |
| Tujuan          | High Availability                                    | Scaling untuk read traffic             |
| Replikasi       | Sinkron                                              | Asinkron                               |
| Dapat dibaca?   | Tidak, secondary tidak dapat diakses untuk pembacaan | Ya                                     |
| Jumlah maksimum | Satu standby                                         | Lima                                   |
| Failover        | Otomatis                                             | Manual (promosi menjadi DB independen) |

### Amazon Aurora 🔴 _Prioritas Tinggi_

Menyimpan enam salinan data pada tiga Availability Zone — proses penulisan tetap berjalan meski kehilangan dua salinan, dan proses pembacaan tetap berjalan meski kehilangan tiga salinan. Aurora Replica mendukung hingga 15 replica dengan failover otomatis dan latency dalam hitungan milidetik, dibandingkan MySQL Replica yang hanya mendukung lima replica dengan failover manual.

**Aurora Serverless** menyediakan penyesuaian kapasitas compute secara otomatis berdasarkan permintaan, dengan biaya dihitung per detik pemakaian — sangat sesuai untuk beban kerja yang bersifat variabel atau sulit diprediksi.

**RDS Proxy** ⚠️ menyediakan _connection pooling_ terkelola di depan RDS/Aurora, mencegah terjadinya "connection storm" dari aplikasi serverless seperti Lambda yang membuka banyak koneksi database secara bersamaan. _(Topik ini ditambahkan berdasarkan dokumentasi AWS.)_

### Amazon DynamoDB 🔴 _Prioritas Tinggi_

| Aspek                    | Local Secondary Index (LSI)   | Global Secondary Index (GSI)            |
| ------------------------ | ----------------------------- | --------------------------------------- |
| Kapan dibuat             | Hanya saat table dibuat       | Kapan saja                              |
| Partition key            | Harus sama dengan table utama | Dapat berbeda                           |
| Kapasitas                | Berbagi dengan table utama    | Terpisah                                |
| Jumlah maksimum          | 5                             | 20 (default AWS, dapat ditingkatkan) ⚠️ |
| Strongly consistent read | Tersedia                      | Tidak tersedia                          |

_(Angka "maksimum 20 GSI" merupakan batas default dari dokumentasi AWS, bukan disebutkan secara eksplisit pada cheat sheet Neal Davis.)_

Mode kapasitas tersedia dalam dua pilihan: Provisioned (RCU/WCU diatur manual atau auto-scale) dan On-Demand (dibayar per request, dengan batas perpindahan mode maksimum satu kali per hari). DAX menyediakan _cache_ khusus untuk operasi baca dengan percepatan hingga sepuluh kali lipat. **DynamoDB Streams** mencatat perubahan data secara berurutan berdasarkan waktu dan umum digunakan sebagai event source bagi Lambda. **Global Tables** menyediakan replikasi multi-region dan multi-master secara terkelola penuh, namun **tidak mendukung strongly consistent read lintas region** — ini merupakan jebakan klasik yang sering muncul di ujian.

### Amazon Redshift ⚪ _Prioritas Rendah_

Merupakan data warehouse yang dirancang untuk beban kerja **OLAP**, bukan OLTP. Deployment hanya tersedia dalam konfigurasi single-AZ. Redshift Spectrum memungkinkan query langsung terhadap data di S3 tanpa perlu memuatnya ke cluster terlebih dahulu.

### Amazon ElastiCache ⚪ _Prioritas Rendah_

| Aspek                | Redis                                  | Memcached                                                      |
| -------------------- | -------------------------------------- | -------------------------------------------------------------- |
| Persistence          | Ya                                     | Tidak                                                          |
| Replikasi & Multi-AZ | Ya                                     | Tidak                                                          |
| Enkripsi             | Ya                                     | Tidak                                                          |
| Arsitektur           | Single-threaded, scaling melalui shard | Multi-threaded, scaling melalui node, mendukung auto-discovery |
| Apabila node gagal   | Tersedia failover (Multi-AZ)           | Data hilang, tanpa replikasi                                   |

---

## 6. Management Tools

### AWS Systems Manager 🔴 _Prioritas Tinggi_

**Session Manager** berfungsi sebagai pengganti bastion host/SSH tradisional, tanpa perlu membuka port 22, dengan autentikasi melalui IAM. **Parameter Store** tersedia dalam tier Standard (gratis) dan Advanced (berbayar). **Patch Manager** menggunakan konsep _patch baseline_ untuk mengelola pembaruan sistem.

### Amazon CloudWatch 🔴 _Prioritas Tinggi_

Retensi metric perlu dihafalkan: metric dengan resolusi di bawah 60 detik disimpan selama 3 jam; resolusi 60 detik disimpan 15 hari; resolusi 300 detik disimpan 63 hari; dan resolusi 3600 detik disimpan hingga 455 hari. Alarm hanya ter-trigger pada perubahan _state_ yang bersifat bertahan (_sustained_), bukan lonjakan sesaat.

Terdapat dua metode untuk "mengeluarkan" data dari CloudWatch Logs, dan keduanya sering tertukar:

- **Export ke S3** (`CreateExportTask`) bersifat _batch_, bukan real-time, dengan potensi keterlambatan hingga 21 jam — sesuai untuk kebutuhan arsip.
- **Subscription Filter** bersifat real-time, mengirimkan log secara streaming menuju Kinesis Data Streams, Kinesis Data Firehose, atau Lambda — pilihan yang tepat ketika soal menyebutkan kebutuhan "tercepat" atau "real-time".

### AWS Cost Management ⚪ _Prioritas Rendah_

| Tool                          | Fungsi                                                                     |
| ----------------------------- | -------------------------------------------------------------------------- |
| **Cost Explorer**             | Visualisasi biaya, data historis 13 bulan, forecast 3 bulan ke depan       |
| **Cost & Usage Report (CUR)** | Laporan tagihan paling detail, dipublikasikan ke S3                        |
| **AWS Budgets**               | Penetapan anggaran disertai notifikasi otomatis saat melewati ambang batas |

### Layanan Manajemen Lainnya ⚪ _Prioritas Rendah_

- **AWS CloudFormation**: Infrastructure as Code berbasis template JSON/YAML. StackSets memungkinkan deploy lintas akun dan region.
- **AWS OpsWorks**: configuration management berbasis Chef/Puppet.
- **AWS Service Catalog** ⚠️: katalog produk IT (template CloudFormation yang telah disetujui) yang dapat digunakan secara self-service oleh user lain tanpa akses penuh ke resource AWS — berguna untuk kebutuhan _governance_. _(Ditambahkan berdasarkan dokumentasi AWS.)_

---

## 7. Analytics & Big Data

Seluruh layanan pada kategori ini termasuk prioritas rendah (⚪) menurut sumber utama.

### Amazon Athena

Layanan serverless untuk menjalankan query SQL langsung terhadap data di S3, dengan biaya dihitung berdasarkan jumlah data yang di-_scan_.

### Amazon Kinesis

| Aspek             | Data Streams                            | Firehose                                              |
| ----------------- | --------------------------------------- | ----------------------------------------------------- |
| Model             | Berbasis shard                          | Tanpa shard, auto-scale                               |
| Retensi & replay  | 24 jam hingga 7 hari, dapat di-_replay_ | Tidak ada retensi, langsung dikirim ke tujuan         |
| Konsumen          | Custom (KCL/Lambda)                     | Tetap: S3, Redshift, OpenSearch Service, atau Splunk  |
| Transformasi data | Dilakukan manual di sisi consumer       | Tersedia built-in melalui Lambda sebelum data dikirim |

### AWS Glue

Layanan ETL serverless yang juga menyediakan Data Catalog, digunakan bersama Athena, Redshift Spectrum, maupun EMR — bukan merupakan query engine.

### Amazon OpenSearch Service

Layanan pencarian dan analitik log berbasis Elasticsearch. Domain yang sudah dibuat tidak dapat dipindahkan antara konfigurasi VPC dan publik.

### Amazon QuickSight ⚠️

Layanan Business Intelligence yang bersifat serverless, digunakan untuk membangun dashboard dan visualisasi interaktif dari berbagai sumber data. _(Ditambahkan berdasarkan dokumentasi AWS mengingat cukup sering muncul sebagai jawaban yang tepat dalam soal latihan.)_

---

## 8. Application Integration & Migration

### SQS, SNS, EventBridge, dan Step Functions

| Layanan            | Model           | Karakteristik                                                                                                                                  |
| ------------------ | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **SQS**            | Pull (antrean)  | Retensi default 4 hari (maksimum 14). Standard mendukung throughput tanpa batas namun berpotensi duplikat; FIFO menjamin urutan tanpa duplikat |
| **SNS**            | Push (pub/sub)  | Mendukung _fan-out_ ke banyak subscriber sekaligus                                                                                             |
| **EventBridge**    | Push, event bus | Menerima event dari berbagai sumber (AWS, SaaS, aplikasi sendiri), melakukan routing berdasarkan rule yang mencocokkan isi event               |
| **Step Functions** | Orkestrasi      | Mengelola workflow multi-tahap dengan biaya dihitung per _state transition_                                                                    |

Salah satu pola yang sering diujikan: ketika sebuah soal menyebutkan kebutuhan mengirimkan satu event ke banyak sistem sekaligus, jawaban yang tepat adalah pola _fan-out_ dari SNS menuju banyak SQS queue — bukan sebaliknya.

### AWS Migration Services

AWS Database Migration Service (DMS) digunakan untuk migrasi database dengan downtime minimal. AWS Elastic Transcoder digunakan untuk transcoding video/audio berbasis S3, dan tidak ditujukan untuk kebutuhan live streaming.

---

## 9. Artificial Intelligence & Machine Learning

Seluruh layanan berikut menyediakan model _pre-trained_ yang siap digunakan melalui API — berbeda dengan Amazon SageMaker yang ditujukan untuk membangun model machine learning sendiri.

| Kebutuhan                                   | Layanan            |
| ------------------------------------------- | ------------------ |
| Analisis gambar/video                       | Amazon Rekognition |
| Ekstraksi data dari dokumen (form, invoice) | Amazon Textract    |
| Konversi suara menjadi teks                 | Amazon Transcribe  |
| Konversi teks menjadi suara                 | Amazon Polly       |
| Penerjemahan bahasa                         | Amazon Translate   |
| Analisis sentimen dan NLP                   | Amazon Comprehend  |
| Chatbot dan voice bot                       | Amazon Lex         |
| Membangun dan melatih model ML sendiri      | Amazon SageMaker   |
| Prediksi time-series                        | Amazon Forecast    |
| Deteksi anomali operasional                 | Amazon DevOps Guru |
| Integrasi data SaaS dengan AWS              | AWS AppFlow        |

---

## 10. Strategi Disaster Recovery

_(Topik ini tidak dibahas secara eksplisit pada cheat sheet Neal Davis manapun yang menjadi sumber utama rangkuman ini, dan disusun berdasarkan AWS Well-Architected Framework serta dokumentasi resmi AWS, mengingat topik RTO/RPO cukup sering muncul dalam soal ujian.)_

Terdapat empat strategi disaster recovery pada AWS, diurutkan dari yang paling murah dengan RTO/RPO paling lambat, hingga yang paling mahal dengan RTO/RPO paling cepat:

| Strategi                     | Cara Kerja                                                                                                                                     | RTO/RPO                                  | Biaya             |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ----------------- |
| **Backup & Restore**         | Backup dilakukan secara rutin; pemulihan dilakukan dari awal di region lain saat terjadi bencana                                               | Paling lambat (hitungan jam hingga hari) | Paling murah      |
| **Pilot Light**              | Komponen inti (umumnya database) tetap berjalan dan tersinkronisasi di region DR secara minimal; komponen lain baru diaktifkan saat dibutuhkan | Lebih cepat dari Backup & Restore        | Menengah ke bawah |
| **Warm Standby**             | Versi berskala kecil dari environment produksi selalu berjalan di region DR, tinggal ditingkatkan kapasitasnya saat dibutuhkan                 | Lebih cepat lagi (hitungan menit)        | Menengah          |
| **Multi-Site Active/Active** | Environment produksi berjalan penuh secara bersamaan di dua region atau lebih                                                                  | Paling cepat, mendekati zero downtime    | Paling mahal      |

**RTO (Recovery Time Objective)** menyatakan berapa lama waktu maksimum yang dapat ditoleransi sebelum sistem kembali pulih. **RPO (Recovery Point Objective)** menyatakan berapa banyak data yang dapat ditoleransi hilang, yang menentukan seberapa sering proses backup atau replikasi perlu dilakukan.

Layanan AWS yang umum digunakan dalam skenario disaster recovery antara lain S3 Cross-Region Replication, RDS/Aurora Read Replica lintas region, Route 53 failover routing, AWS Backup, dan Aurora Global Database.

---

## Latihan Soal: Pola yang Paling Sering Saya Temui

Soal-soal berikut saya kumpulkan dari berbagai bank soal latihan SAA-C03 yang beredar di internet — **bukan soal ujian resmi AWS**, melainkan materi latihan pihak ketiga yang saya kurasi berdasarkan pola yang paling sering berulang, agar Anda mengenali skenario yang umum diujikan.

Soal dan pilihan jawaban ditulis apa adanya dalam Bahasa Inggris sesuai format aslinya, dengan tambahan topik dan alasan jawaban singkat dalam Bahasa Indonesia.

Berikut 65 soal yang saya pilih.

---

**1. Topik: High Availability & Elastic Beanstalk**

A solutions architect is implementing a complex Java application with a MySQL database. The Java application must be deployed on Apache Tomcat and must be highly available. What should the solutions architect do to meet these requirements?

- A. Deploy the application in AWS Lambda. Configure an Amazon API Gateway API to connect with the Lambda functions.
- B. Deploy the application by using AWS Elastic Beanstalk. Configure a load-balanced environment and a rolling deployment policy.
- C. Migrate the database to Amazon ElastiCache. Configure the ElastiCache security group to allow access from the application.
- D. Launch an Amazon EC2 instance. Install a MySQL server on the EC2 instance. Configure the application on the server. Create an AMI. Use the AMI to create a launch template with an Auto Scaling group.

**Correct Answer: B**

Elastic Beanstalk mengelola deployment, load balancing, dan auto-scaling secara otomatis untuk aplikasi Java di Tomcat, sehingga memenuhi kebutuhan high availability tanpa perlu membangun infrastruktur manual.

**2. Topik: S3 Cross-Region Replication**

An online photo-sharing company stores its photos in an Amazon S3 bucket that exists in the us-west-1 Region. The company needs to store a copy of all new photos in the us-east-1 Region. Which solution will meet this requirement with the LEAST operational effort?

- A. Create a second S3 bucket in us-east-1. Use S3 Cross-Region Replication to copy photos from the existing S3 bucket to the second S3 bucket.
- B. Create a cross-origin resource sharing (CORS) configuration of the existing S3 bucket. Specify us-east-1 in the CORS rule's AllowedOrigin element.
- C. Create a second S3 bucket in us-east-1 across multiple Availability Zones. Create an S3 Lifecycle rule to save photos into the second S3 bucket.
- D. Create a second S3 bucket in us-east-1. Configure S3 event notifications on object creation and update events to invoke an AWS Lambda function to copy photos from the existing S3 bucket to the second S3 bucket.

**Correct Answer: A**

S3 Cross-Region Replication adalah fitur bawaan S3 yang secara otomatis mereplikasi objek antar region tanpa proses manual atau Lambda tambahan, sehingga operasionalnya paling ringan.

**3. Topik: EFS vs Instance Store**

A company's website uses an Amazon EC2 instance store for its catalog of items. The company wants to make sure that the catalog is highly available and that the catalog is stored in a durable location. What should a solutions architect do to meet these requirements?

- A. Move the catalog to Amazon ElastiCache for Redis.
- B. Deploy a larger EC2 instance with a larger instance store.
- C. Move the catalog from the instance store to Amazon S3 Glacier Deep Archive.
- D. Move the catalog to an Amazon Elastic File System (Amazon EFS) file system.

**Correct Answer: D**

EFS adalah shared file system yang fully managed, durable, dan highly available — cocok menggantikan instance store yang sifatnya non-persistent dan tidak durable.

**4. Topik: AWS Transfer Family (SFTP)**

A company uses Amazon S3 as its data lake. The company has a new partner that must use SFTP to upload data files. A solutions architect needs to implement a highly available SFTP solution that minimizes operational overhead. Which solution will meet these requirements?

- A. Use AWS Transfer Family to configure an SFTP-enabled server with a publicly accessible endpoint. Choose the S3 data lake as the destination.
- B. Use Amazon S3 File Gateway as an SFTP server. Expose the S3 File Gateway endpoint URL to the new partner. Share the S3 File Gateway endpoint with the new partner.
- C. Launch an Amazon EC2 instance in a private subnet in a VPC. Instruct the new partner to upload files to the EC2 instance by using a VPN. Run a cron job script on the EC2 instance to upload files to the S3 data lake.
- D. Launch Amazon EC2 instances in a private subnet in a VPC. Place a Network Load Balancer (NLB) in front of the EC2 instances. Create an SFTP listener port for the NLB. Share the NLB hostname with the new partner. Run a cron job script on the EC2 instances to upload files to the S3 data lake.

**Correct Answer: A**

AWS Transfer Family menyediakan server SFTP terkelola penuh menuju S3, sehingga tidak perlu membangun atau mengelola server SFTP sendiri di EC2.

**5. Topik: ALB Private Subnet + CloudFront**

A solutions architect needs to design a highly available application consisting of web, application, and database tiers. HTTPS content delivery should be as close to the edge as possible, with the least delivery time. Which solution meets these requirements and is MOST secure?

- A. Configure a public Application Load Balancer (ALB) with multiple redundant Amazon EC2 instances in public subnets. Configure Amazon CloudFront to deliver HTTPS content using the public ALB as the origin.
- B. Configure a public Application Load Balancer with multiple redundant Amazon EC2 instances in private subnets. Configure Amazon CloudFront to deliver HTTPS content using the EC2 instances as the origin.
- C. Configure a public Application Load Balancer (ALB) with multiple redundant Amazon EC2 instances in private subnets. Configure Amazon CloudFront to deliver HTTPS content using the public ALB as the origin.
- D. Configure a public Application Load Balancer with multiple redundant Amazon EC2 instances in public subnets. Configure Amazon CloudFront to deliver HTTPS content using the EC2 instances as the origin.

**Correct Answer: C**

Menempatkan ALB di private subnet (bukan public) menambah lapisan keamanan, sementara CloudFront tetap menjadi origin publik yang melayani permintaan HTTPS dengan latency rendah.

**6. Topik: RDS Multi-AZ untuk RPO Ketat**

A company runs a fleet of web servers using an Amazon RDS for PostgreSQL DB instance. After a routine compliance check, the company sets a standard that requires a recovery point objective (RPO) of less than 1 second for all its production databases. Which solution meets these requirements?

- A. Enable a Multi-AZ deployment for the DB instance.
- B. Enable auto scaling for the DB instance in one Availability Zone.
- C. Configure the DB instance in one Availability Zone, and create multiple read replicas in a separate Availability Zone.
- D. Configure the DB instance in one Availability Zone, and configure AWS Database Migration Service (AWS DMS) change data capture (CDC) tasks.

**Correct Answer: A**

Multi-AZ RDS melakukan replikasi sinkron ke standby sehingga RPO-nya mendekati nol — read replica yang bersifat asinkron tidak bisa menjamin RPO di bawah 1 detik.

**7. Topik: FSx for Windows File Server**

A company has a Windows-based application that must be migrated to AWS. The application requires the use of a shared Windows file system attached to multiple Amazon EC2 Windows instances that are deployed across multiple Availability Zones. What should a solutions architect do to meet this requirement?

- A. Configure AWS Storage Gateway in volume gateway mode. Mount the volume to each Windows instance.
- B. Configure Amazon FSx for Windows File Server. Mount the Amazon FSx file system to each Windows instance.
- C. Configure a file system by using Amazon Elastic File System (Amazon EFS). Mount the EFS file system to each Windows instance.
- D. Configure an Amazon Elastic Block Store (Amazon EBS) volume with the required size. Attach each EC2 instance to the volume. Mount the file system within the volume to each Windows instance.

**Correct Answer: B**

FSx for Windows File Server dirancang khusus sebagai shared file system berbasis SMB yang dapat di-mount ke banyak instance Windows sekaligus.

**8. Topik: NAT Gateway Multi-AZ**

A company is concerned that two NAT instances in use will no longer be able to support the traffic needed for the company’s application. A solutions architect wants to implement a solution that is highly available, fault tolerant, and automatically scalable. What should the solutions architect recommend?

- A. Remove the two NAT instances and replace them with two NAT gateways in the same Availability Zone.
- B. Use Auto Scaling groups with Network Load Balancers for the NAT instances in different Availability Zones.
- C. Remove the two NAT instances and replace them with two NAT gateways in different Availability Zones.
- D. Replace the two NAT instances with Spot Instances in different Availability Zones and deploy a Network Load Balancer.

**Correct Answer: C**

NAT Gateway adalah layanan managed yang otomatis HA dan scalable; menempatkannya di AZ berbeda memberikan fault tolerance yang tidak bisa didapat dari NAT instance.

**9. Topik: EBS gp3 untuk Lift-and-Shift**

A company uses locally attached storage to run a latency-sensitive application on premises. The company is using a lift and shift method to move the application to the AWS Cloud. The company does not want to change the application architecture. Which solution will meet these requirements MOST cost-effectively?

- A. Configure an Auto Scaling group with an Amazon EC2 instance. Use an Amazon FSx for Lustre file system to run the application.
- B. Host the application on an Amazon EC2 instance. Use an Amazon Elastic Block Store (Amazon EBS) GP2 volume to run the application.
- C. Configure an Auto Scaling group with an Amazon EC2 instance. Use an Amazon FSx for OpenZFS file system to run the application.
- D. Host the application on an Amazon EC2 instance. Use an Amazon Elastic Block Store (Amazon EBS) GP3 volume to run the application.

**Correct Answer: D**

gp3 memberikan performa yang baik dengan biaya lebih rendah dibanding gp2, cocok untuk migrasi lift-and-shift tanpa mengubah arsitektur aplikasi.

**10. Topik: EBS Fast Snapshot Restore**

A company is experiencing sudden increases in demand. The company needs to provision large Amazon EC2 instances from an Amazon Machine Image (AMI). The instances will run in an Auto Scaling group. The company needs a solution that provides minimum initialization latency to meet the demand. Which solution meets these requirements?

- A. Use the aws ec2 register-image command to create an AMI from a snapshot. Use AWS Step Functions to replace the AMI in the Auto Scaling group.
- B. Enable Amazon Elastic Block Store (Amazon EBS) fast snapshot restore on a snapshot. Provision an AMI by using the snapshot. Replace the AMI in the Auto Scaling group with the new AMI.
- C. Enable AMI creation and define lifecycle rules in Amazon Data Lifecycle Manager (Amazon DLM). Create an AWS Lambda function that modifies the AMI in the Auto Scaling group.
- D. Use Amazon EventBridge to invoke AWS Backup lifecycle policies that provision AMIs. Configure Auto Scaling group capacity limits as an event source in EventBridge.

**Correct Answer: B**

Fast snapshot restore mempercepat proses pembuatan volume EBS dari snapshot, sehingga AMI baru dapat langsung dipakai tanpa latency inisialisasi yang lama.

**11. Topik: Dynamic Scaling**

A company's applications run on Amazon EC2 instances in Auto Scaling groups. The company notices that its applications experience sudden traffic increases on random days of the week. The company wants to maintain application performance during sudden traffic increases. Which solution will meet these requirements MOST cost-effectively?

- A. Use manual scaling to change the size of the Auto Scaling group.
- B. Use predictive scaling to change the size of the Auto Scaling group.
- C. Use dynamic scaling to change the size of the Auto Scaling group.
- D. Use schedule scaling to change the size of the Auto Scaling group.

**Correct Answer: C**

Dynamic scaling menyesuaikan kapasitas secara otomatis berdasarkan demand real-time, cocok untuk lonjakan traffic yang tidak terjadwal atau bersifat acak.

**12. Topik: Arsitektur Serverless Statis + Dinamis**

An ecommerce company wants to launch a one-deal-a-day website on AWS. Each day will feature exactly one product on sale for a period of 24 hours. The company wants to be able to handle millions of requests each hour with millisecond latency during peak hours. Which solution will meet these requirements with the LEAST operational overhead?

- A. Use Amazon S3 to host the full website in different S3 buckets. Add Amazon CloudFront distributions. Set the S3 buckets as origins for the distributions. Store the order data in Amazon S3.
- B. Deploy the full website on Amazon EC2 instances that run in Auto Scaling groups across multiple Availability Zones. Add an Application Load Balancer (ALB) to distribute the website traffic. Add another ALB for the backend APIs. Store the data in Amazon RDS for MySQL.
- C. Migrate the full application to run in containers. Host the containers on Amazon Elastic Kubernetes Service (Amazon EKS). Use the Kubernetes Cluster Autoscaler to increase and decrease the number of pods to process bursts in traffic. Store the data in Amazon RDS for MySQL.
- D. Use an Amazon S3 bucket to host the website's static content. Deploy an Amazon CloudFront distribution. Set the S3 bucket as the origin. Use Amazon API Gateway and AWS Lambda functions for the backend APIs. Store the data in Amazon DynamoDB.

**Correct Answer: D**

Kombinasi S3 dan CloudFront untuk konten statis, serta API Gateway, Lambda, dan DynamoDB untuk backend, memberikan skalabilitas tinggi tanpa server yang perlu dikelola — paling efisien secara operasional untuk traffic musiman yang ekstrem.

**13. Topik: Kombinasi EC2 Purchasing Option**

A company hosts a web application on multiple Amazon EC2 instances. The EC2 instances are in an Auto Scaling group that scales in response to user demand. The company wants to optimize cost savings without making a long-term commitment. Which EC2 instance purchasing option should a solutions architect recommend to meet these requirements?

- A. Dedicated Instances only
- B. On-Demand Instances only
- C. A mix of On-Demand Instances and Spot Instances
- D. A mix of On-Demand Instances and Reserved Instances

**Correct Answer: C**

Kombinasi On-Demand dan Spot Instance memberikan penghematan biaya signifikan tanpa komitmen jangka panjang, cocok untuk workload yang pola scale in/out-nya mengikuti demand.

**14. Topik: Elastic Beanstalk Blue/Green**

A company has a web application that is based on Java and PHP. The company plans to move the application from on premises to AWS. The company needs the ability to test new site features frequently. The company also needs a highly available and managed solution that requires minimum operational overhead. Which solution will meet these requirements?

- A. Create an Amazon S3 bucket. Enable static web hosting on the S3 bucket. Upload the static content to the S3 bucket. Use AWS Lambda to process all dynamic content.
- B. Deploy the web application to an AWS Elastic Beanstalk environment. Use URL swapping to switch between multiple Elastic Beanstalk environments for feature testing.
- C. Deploy the web application to Amazon EC2 instances that are configured with Java and PHP. Use Auto Scaling groups and an Application Load Balancer to manage the website’s availability.
- D. Containerize the web application. Deploy the web application to Amazon EC2 instances. Use the AWS Load Balancer Controller to dynamically route traffic between containers that contain the new site features for testing.

**Correct Answer: B**

Elastic Beanstalk mendukung pertukaran URL antar environment (blue/green), sehingga fitur baru dapat diuji tanpa mengganggu environment produksi.

**15. Topik: Static Website Hosting di S3**

A development team needs to host a website that will be accessed by other teams. The website contents consist of HTML, CSS, client-side JavaScript, and images. Which method is the MOST cost-effective for hosting the website?

- A. Containerize the website and host it in AWS Fargate.
- B. Create an Amazon S3 bucket and host the website there.
- C. Deploy a web server on an Amazon EC2 instance to host the website.
- D. Configure an Application Load Balancer with an AWS Lambda target that uses the Express.js framework.

**Correct Answer: B**

Untuk website yang murni statis (HTML/CSS/JavaScript), S3 merupakan pilihan paling murah karena tidak membutuhkan compute atau server sama sekali.

**16. Topik: Snowball Edge + DMS untuk Migrasi Database Besar**

A company needs to migrate a MySQL database from its on-premises data center to AWS within 2 weeks. The database is 20 TB in size. The company wants to complete the migration with minimal downtime. Which solution will migrate the database MOST cost-effectively?

- A. Order an AWS Snowball Edge Storage Optimized device. Use AWS Database Migration Service (AWS DMS) with AWS Schema Conversion Tool (AWS SCT) to migrate the database with replication of ongoing changes. Send the Snowball Edge device to AWS to finish the migration and continue the ongoing replication.
- B. Order an AWS Snowmobile vehicle. Use AWS Database Migration Service (AWS DMS) with AWS Schema Conversion Tool (AWS SCT) to migrate the database with ongoing changes. Send the Snowmobile vehicle back to AWS to finish the migration and continue the ongoing replication.
- C. Order an AWS Snowball Edge Compute Optimized with GPU device. Use AWS Database Migration Service (AWS DMS) with AWS Schema Conversion Tool (AWS SCT) to migrate the database with ongoing changes. Send the Snowball device to AWS to finish the migration and continue the ongoing replication.
- D. Order a 1 GB dedicated AWS Direct Connect connection to establish a connection with the data center. Use AWS Database Migration Service (AWS DMS) with AWS Schema Conversion Tool (AWS SCT) to migrate the database with replication of ongoing changes.

**Correct Answer: A**

Snowball Edge menangani transfer data besar secara fisik, sementara AWS DMS dengan replikasi berkelanjutan menjaga data tetap sinkron hingga proses cutover, sehingga downtime dapat diminimalkan.

**17. Topik: ECS Fargate + EventBridge untuk Batch Job**

A solutions architect is creating a data processing job that runs once daily and can take up to 2 hours to complete. If the job is interrupted, it has to restart from the beginning. How should the solutions architect address this issue in the MOST cost-effective manner?

- A. Create a script that runs locally on an Amazon EC2 Reserved Instance that is triggered by a cron job.
- B. Create an AWS Lambda function triggered by an Amazon EventBridge scheduled event.
- C. Use an Amazon Elastic Container Service (Amazon ECS) Fargate task triggered by an Amazon EventBridge scheduled event.
- D. Use an Amazon Elastic Container Service (Amazon ECS) task running on Amazon EC2 triggered by an Amazon EventBridge scheduled event.

**Correct Answer: C**

ECS Fargate bersifat serverless sehingga tidak perlu mengelola EC2, dan dapat dipicu secara terjadwal oleh EventBridge — paling hemat biaya untuk job harian yang hanya berjalan selama dua jam.

**18. Topik: CloudFront untuk Website Statis di S3**

A company is hosting a static website on Amazon S3 and is using Amazon Route 53 for DNS. The website is experiencing increased demand from around the world. The company must decrease latency for users who access the website. Which solution meets these requirements MOST cost-effectively?

- A. Replicate the S3 bucket that contains the website to all AWS Regions. Add Route 53 geolocation routing entries.
- B. Provision accelerators in AWS Global Accelerator. Associate the supplied IP addresses with the S3 bucket. Edit the Route 53 entries to point to the IP addresses of the accelerators.
- C. Add an Amazon CloudFront distribution in front of the S3 bucket. Edit the Route 53 entries to point to the CloudFront distribution.
- D. Enable S3 Transfer Acceleration on the bucket. Edit the Route 53 entries to point to the new endpoint.

**Correct Answer: C**

CloudFront menyimpan cache konten dari S3 di edge location terdekat dengan pengguna, sehingga secara signifikan menurunkan latency dibanding mereplikasi bucket ke seluruh region.

**19. Topik: S3 Lifecycle ke Glacier Deep Archive**

A company is storing backup files by using Amazon S3 Standard storage. The files are accessed frequently for 1 month. However, the files are not accessed after 1 month. The company must keep the files indefinitely. Which storage solution will meet these requirements MOST cost-effectively?

- A. Configure S3 Intelligent-Tiering to automatically migrate objects.
- B. Create an S3 Lifecycle configuration to transition objects from S3 Standard to S3 Glacier Deep Archive after 1 month.
- C. Create an S3 Lifecycle configuration to transition objects from S3 Standard to S3 Standard-Infrequent Access (S3 Standard-IA) after 1 month.
- D. Create an S3 Lifecycle configuration to transition objects from S3 Standard to S3 One Zone-Infrequent Access (S3 One Zone-IA) after 1 month.

**Correct Answer: B**

Karena data harus disimpan selamanya namun tidak pernah diakses lagi setelah satu bulan, Glacier Deep Archive merupakan kelas penyimpanan termurah yang sesuai untuk kebutuhan ini.

**20. Topik: VPC Peering dalam Satu Akun**

A company has two VPCs that are located in the us-west-2 Region within the same AWS account. The company needs to allow network traffic between these VPCs. Approximately 500 GB of data transfer will occur between the VPCs each month. What is the MOST cost-effective solution to connect these VPCs?

- A. Implement AWS Transit Gateway to connect the VPCs. Update the route tables of each VPC to use the transit gateway for inter-VPC communication.
- B. Implement an AWS Site-to-Site VPN tunnel between the VPCs. Update the route tables of each VPC to use the VPN tunnel for inter-VPC communication.
- C. Set up a VPC peering connection between the VPCs. Update the route tables of each VPC to use the VPC peering connection for inter-VPC communication.
- D. Set up a 1 GB AWS Direct Connect connection between the VPCs. Update the route tables of each VPC to use the Direct Connect connection for inter-VPC communication.

**Correct Answer: C**

Untuk menghubungkan dua VPC dalam akun dan region yang sama dengan volume data yang moderat, VPC Peering adalah solusi paling sederhana dan murah dibanding Transit Gateway atau Direct Connect.

**21. Topik: ECS Scheduled Task di Fargate**

A company containerized a Windows job that runs on .NET 6 Framework under a Windows container. The company wants to run this job in the AWS Cloud. The job runs every 10 minutes. The job’s runtime varies between 1 minute and 3 minutes. Which solution will meet these requirements MOST cost-effectively?

- A. Create an AWS Lambda function based on the container image of the job. Configure Amazon EventBridge to invoke the function every 10 minutes.
- B. Use AWS Batch to create a job that uses AWS Fargate resources. Configure the job scheduling to run every 10 minutes.
- C. Use Amazon Elastic Container Service (Amazon ECS) on AWS Fargate to run the job. Create a scheduled task based on the container image of the job to run every 10 minutes.
- D. Use Amazon Elastic Container Service (Amazon ECS) on AWS Fargate to run the job. Create a standalone task based on the container image of the job. Use Windows task scheduler to run the job every 10 minutes.

**Correct Answer: C**

ECS scheduled task di atas Fargate cocok untuk job container singkat yang berjalan secara berkala, tanpa perlu mengelola infrastruktur maupun scheduler tambahan seperti AWS Batch.

**22. Topik: Amazon Athena untuk Query CloudTrail**

A company wants to analyze and troubleshoot Access Denied errors and Unauthorized errors that are related to IAM permissions. The company has AWS CloudTrail turned on. Which solution will meet these requirements with the LEAST effort?

- A. Use AWS Glue and write custom scripts to query CloudTrail logs for the errors.
- B. Use AWS Batch and write custom scripts to query CloudTrail logs for the errors.
- C. Search CloudTrail logs with Amazon Athena queries to identify the errors.
- D. Search CloudTrail logs with Amazon QuickSight. Create a dashboard to identify the errors.

**Correct Answer: C**

Athena memungkinkan query SQL langsung terhadap log CloudTrail yang tersimpan di S3, tanpa perlu menulis script custom.

**23. Topik: Amazon S3 Storage Lens**

A solutions architect needs to optimize storage costs. The solutions architect must identify any Amazon S3 buckets that are no longer being accessed or are rarely accessed. Which solution will accomplish this goal with the LEAST operational overhead?

- A. Analyze bucket access patterns by using the S3 Storage Lens dashboard for advanced activity metrics.
- B. Analyze bucket access patterns by using the S3 dashboard in the AWS Management Console.
- C. Turn on the Amazon CloudWatch BucketSizeBytes metric for buckets. Analyze bucket access patterns by using the metrics data with Amazon Athena.
- D. Turn on AWS CloudTrail for S3 object monitoring. Analyze bucket access patterns by using CloudTrail logs that are integrated with Amazon CloudWatch Logs.

**Correct Answer: A**

S3 Storage Lens menyediakan dashboard analitik bawaan untuk memahami pola akses bucket, tanpa perlu membangun sistem monitoring custom.

**24. Topik: Secrets Manager: Rotasi Otomatis RDS**

A company runs its databases on Amazon RDS for PostgreSQL. The company wants a secure solution to manage the master user password by rotating the password every 30 days. Which solution will meet these requirements with the LEAST operational overhead?

- A. Use Amazon EventBridge to schedule a custom AWS Lambda function to rotate the password every 30 days.
- B. Use the modify-db-instance command in the AWS CLI to change the password.
- C. Integrate AWS Secrets Manager with Amazon RDS for PostgreSQL to automate password rotation.
- D. Integrate AWS Systems Manager Parameter Store with Amazon RDS for PostgreSQL to automate password rotation.

**Correct Answer: C**

Secrets Manager terintegrasi secara native dengan RDS untuk rotasi password otomatis secara terjadwal, tanpa memerlukan fungsi Lambda custom.

**25. Topik: Migrasi RDS ke Aurora via Read Replica**

A company runs its critical database on an Amazon RDS for PostgreSQL DB instance. The company wants to migrate to Amazon Aurora PostgreSQL with minimal downtime and data loss. Which solution will meet these requirements with the LEAST operational overhead?

- A. Create a DB snapshot of the RDS for PostgreSQL DB instance to populate a new Aurora PostgreSQL DB cluster.
- B. Create an Aurora read replica of the RDS for PostgreSQL DB instance. Promote the Aurora read replicate to a new Aurora PostgreSQL DB cluster.
- C. Use data import from Amazon S3 to migrate the database to an Aurora PostgreSQL DB cluster.
- D. Use the pg_dump utility to back up the RDS for PostgreSQL database. Restore the backup to a new Aurora PostgreSQL DB cluster.

**Correct Answer: B**

Membuat Aurora read replica dari RDS lalu mempromosikannya merupakan cara migrasi dengan downtime paling minim, karena replikasi berjalan sementara sistem lama tetap online.

**26. Topik: DynamoDB + DAX + Athena**

A company hosts a multiplayer gaming application on AWS. The company wants the application to read data with sub-millisecond latency and run one-time queries on historical data. Which solution will meet these requirements with the LEAST operational overhead?

- A. Use Amazon RDS for data that is frequently accessed. Run a periodic custom script to export the data to an Amazon S3 bucket.
- B. Store the data directly in an Amazon S3 bucket. Implement an S3 Lifecycle policy to move older data to S3 Glacier Deep Archive for long- term storage. Run one-time queries on the data in Amazon S3 by using Amazon Athena.
- C. Use Amazon DynamoDB with DynamoDB Accelerator (DAX) for data that is frequently accessed. Export the data to an Amazon S3 bucket by using DynamoDB table export. Run one-time queries on the data in Amazon S3 by using Amazon Athena.
- D. Use Amazon DynamoDB for data that is frequently accessed. Turn on streaming to Amazon Kinesis Data Streams. Use Amazon Kinesis Data Firehose to read the data from Kinesis Data Streams. Store the records in an Amazon S3 bucket.

**Correct Answer: C**

DAX memberikan latency sub-milidetik untuk data yang sering diakses, sementara data historis diekspor ke S3 dan di-query sesekali melalui Athena — kombinasi ini paling sesuai untuk dua pola akses yang berbeda.

**27. Topik: AWS Config + Tagging untuk AWS Backup**

A company uses AWS Organizations with resources tagged by account. The company also uses AWS Backup to back up its AWS infrastructure resources. The company needs to back up all AWS resources. Which solution will meet these requirements with the LEAST operational overhead?

- A. Use AWS Config to identify all untagged resources. Tag the identified resources programmatically. Use tags in the backup plan.
- B. Use AWS Config to identify all resources that are not running. Add those resources to the backup vault.
- C. Require all AWS account owners to review their resources to identify the resources that need to be backed up.
- D. Use Amazon Inspector to identify all noncompliant resources.

**Correct Answer: A**

AWS Config dapat mengidentifikasi resource yang belum diberi tag secara otomatis, sehingga tag tersebut dapat langsung dimanfaatkan oleh backup plan tanpa proses manual per akun.

**28. Topik: AWS Config + Systems Manager untuk Compliance EBS**

A company needs a solution to enforce data encryption at rest on Amazon EC2 instances. The solution must automatically identify noncompliant resources and enforce compliance policies on findings. Which solution will meet these requirements with the LEAST administrative overhead?

- A. Use an IAM policy that allows users to create only encrypted Amazon Elastic Block Store (Amazon EBS) volumes. Use AWS Config and AWS Systems Manager to automate the detection and remediation of unencrypted EBS volumes.
- B. Use AWS Key Management Service (AWS KMS) to manage access to encrypted Amazon Elastic Block Store (Amazon EBS) volumes. Use AWS Lambda and Amazon EventBridge to automate the detection and remediation of unencrypted EBS volumes.
- C. Use Amazon Macie to detect unencrypted Amazon Elastic Block Store (Amazon EBS) volumes. Use AWS Systems Manager Automation rules to automatically encrypt existing and new EBS volumes.
- D. Use Amazon inspector to detect unencrypted Amazon Elastic Block Store (Amazon EBS) volumes. Use AWS Systems Manager Automation rules to automatically encrypt existing and new EBS volumes.

**Correct Answer: A**

AWS Config mendeteksi volume EBS yang tidak terenkripsi, dan Systems Manager Automation menjalankan remediasi secara otomatis — kombinasi deteksi dan penegakan kebijakan dengan overhead paling rendah.

**29. Topik: AWS Config untuk Deteksi Perubahan S3**

A company needs to review its AWS Cloud deployment to ensure that its Amazon S3 buckets do not have unauthorized configuration changes. What should a solutions architect do to accomplish this goal?

- A. Turn on AWS Config with the appropriate rules.
- B. Turn on AWS Trusted Advisor with the appropriate checks.
- C. Turn on Amazon Inspector with the appropriate assessment template.
- D. Turn on Amazon S3 server access logging. Configure Amazon EventBridge (Amazon Cloud Watch Events).

**Correct Answer: A**

AWS Config secara khusus dirancang untuk memantau dan mencatat perubahan konfigurasi resource, termasuk bucket S3.

**30. Topik: VPC Flow Logs ke S3 + Lifecycle**

A company’s security team requests that network traffic be captured in VPC Flow Logs. The logs will be frequently accessed for 90 days and then accessed intermittently. What should a solutions architect do to meet these requirements when configuring the logs?

- A. Use Amazon CloudWatch as the target. Set the CloudWatch log group with an expiration of 90 days
- B. Use Amazon Kinesis as the target. Configure the Kinesis stream to always retain the logs for 90 days.
- C. Use AWS CloudTrail as the target. Configure CloudTrail to save to an Amazon S3 bucket, and enable S3 Intelligent-Tiering.
- D. Use Amazon S3 as the target. Enable an S3 Lifecycle policy to transition the logs to S3 Standard-Infrequent Access (S3 Standard-IA) after 90 days.

**Correct Answer: D**

Mengarahkan Flow Logs ke S3 memungkinkan penggunaan S3 Lifecycle untuk secara otomatis memindahkan data ke tier yang lebih murah setelah periode akses tinggi berakhir.

**31. Topik: AWS Backup untuk DynamoDB dengan Retensi Panjang**

A company has an application that is backed by an Amazon DynamoDB table. The company’s compliance requirements specify that database backups must be taken every month, must be available for 6 months, and must be retained for 7 years. Which solution will meet these requirements?

- A. Create an AWS Backup plan to back up the DynamoDB table on the first day of each month. Specify a lifecycle policy that transitions the backup to cold storage after 6 months. Set the retention period for each backup to 7 years.
- B. Create a DynamoDB on-demand backup of the DynamoDB table on the first day of each month. Transition the backup to Amazon S3 Glacier Flexible Retrieval after 6 months. Create an S3 Lifecycle policy to delete backups that are older than 7 years.
- C. Use the AWS SDK to develop a script that creates an on-demand backup of the DynamoDB table. Set up an Amazon EventBridge rule that runs the script on the first day of each month. Create a second script that will run on the second day of each month to transition DynamoDB backups that are older than 6 months to cold storage and to delete backups that are older than 7 years.
- D. Use the AWS CLI to create an on-demand backup of the DynamoDB table. Set up an Amazon EventBridge rule that runs the command on the first day of each month with a cron expression. Specify in the command to transition the backups to cold storage after 6 months and to delete the backups after 7 years.

**Correct Answer: A**

AWS Backup mendukung jadwal backup, lifecycle menuju cold storage, dan retention period secara native dalam satu backup plan, tanpa memerlukan script custom.

**32. Topik: Amazon Macie Multi-Region**

A solutions architect needs to review a company's Amazon S3 buckets to discover personally identifiable information (PII). The company stores the PII data in the us-east-1 Region and us-west-2 Region. Which solution will meet these requirements with the LEAST operational overhead?

- A. Configure Amazon Macie in each Region. Create a job to analyze the data that is in Amazon S3.
- B. Configure AWS Security Hub for all Regions. Create an AWS Config rule to analyze the data that is in Amazon S3.
- C. Configure Amazon Inspector to analyze the data that is in Amazon S3.
- D. Configure Amazon GuardDuty to analyze the data that is in Amazon S3.

**Correct Answer: A**

Macie secara otomatis mendeteksi dan mengklasifikasikan data sensitif (PII) di S3 menggunakan machine learning, cukup dikonfigurasi per region tanpa tool tambahan.

**33. Topik: CloudFormation + Config untuk Audit Trail**

A company has customers located across the world. The company wants to use automation to secure its systems and network infrastructure. The company's security team must be able to track and audit all incremental changes to the infrastructure. Which solution will meet these requirements?

- A. Use AWS Organizations to set up the infrastructure. Use AWS Config to track changes.
- B. Use AWS CloudFormation to set up the infrastructure. Use AWS Config to track changes.
- C. Use AWS Organizations to set up the infrastructure. Use AWS Service Catalog to track changes.
- D. Use AWS CloudFormation to set up the infrastructure. Use AWS Service Catalog to track changes.

**Correct Answer: B**

CloudFormation menyediakan otomasi infrastruktur, sementara AWS Config secara khusus melacak setiap perubahan konfigurasi untuk kebutuhan audit — Service Catalog lebih ditujukan untuk governance, bukan pelacakan perubahan.

**34. Topik: AWS Config vs AWS CloudTrail**

A company hosts its multi-tier applications on AWS. For compliance, governance, auditing, and security, the company must track configuration changes on its AWS resources and record a history of API calls made to these resources. What should a solutions architect do to meet these requirements?

- A. Use AWS CloudTrail to track configuration changes and AWS Config to record API calls.
- B. Use AWS Config to track configuration changes and AWS CloudTrail to record API calls.
- C. Use AWS Config to track configuration changes and Amazon CloudWatch to record API calls.
- D. Use AWS CloudTrail to track configuration changes and Amazon CloudWatch to record API calls.

**Correct Answer: B**

AWS Config melacak riwayat perubahan konfigurasi resource, sedangkan CloudTrail mencatat API call — keduanya sering tertukar padahal fungsinya berbeda dan saling melengkapi.

**35. Topik: AWS Backup Vault Lock Compliance Mode**

A company wants to implement a backup strategy for Amazon EC2 data and multiple Amazon S3 buckets. Because of regulatory requirements, the company must retain backup files for a specific time period. The company must not alter the files for the duration of the retention period. Which solution will meet these requirements?

- A. Use AWS Backup to create a backup vault that has a vault lock in governance mode. Create the required backup plan.
- B. Use Amazon Data Lifecycle Manager to create the required automated snapshot policy.
- C. Use Amazon S3 File Gateway to create the backup. Configure the appropriate S3 Lifecycle management.
- D. Use AWS Backup to create a backup vault that has a vault lock in compliance mode. Create the required backup plan.

**Correct Answer: D**

Compliance mode pada Vault Lock memastikan backup benar-benar tidak dapat diubah atau dihapus oleh siapa pun selama masa retensi, sesuai kebutuhan regulasi — governance mode masih dapat di-override.

**36. Topik: S3 File Gateway + Lifecycle ke Glacier Deep Archive**

A company runs an SMB file server in its data center. The file server stores large files that the company frequently accesses for up to 7 days after the file creation date. After 7 days, the company needs to be able to access the files with a maximum retrieval time of 24 hours. Which solution will meet these requirements?

- A. Use AWS DataSync to copy data that is older than 7 days from the SMB file server to AWS.
- B. Create an Amazon S3 File Gateway to increase the company's storage space. Create an S3 Lifecycle policy to transition the data to S3 Glacier Deep Archive after 7 days.
- C. Create an Amazon FSx File Gateway to increase the company's storage space. Create an Amazon S3 Lifecycle policy to transition the data after 7 days.
- D. Configure access to Amazon S3 for each user. Create an S3 Lifecycle policy to transition the data to S3 Glacier Flexible Retrieval after 7 days.

**Correct Answer: B**

File Gateway memperluas storage on-premises ke S3 secara transparan, dan lifecycle policy secara otomatis memindahkan data ke Glacier Deep Archive begitu masa akses cepat berakhir.

**37. Topik: Retensi Objek S3 Selama 30 Hari**

A company wants to back up its on-premises virtual machines (VMs) to AWS. The company's backup solution exports on-premises backups to an Amazon S3 bucket as objects. The S3 backups must be retained for 30 days and must be automatically deleted after 30 days. Which combination of steps will meet these requirements? (Choose three.)

- A. Create an S3 bucket that has S3 Object Lock enabled.
- B. Create an S3 bucket that has object versioning enabled.
- C. Configure a default retention period of 30 days for the objects.
- D. Configure an S3 Lifecycle policy to protect the objects for 30 days.
- E. Configure an S3 Lifecycle policy to expire the objects after 30 days.
- F. Configure the backup solution to tag the objects with a 30-day retention period

**Correct Answer: E**

Kombinasi retention period tetap dan lifecycle expiration merupakan cara paling langsung untuk menjamin objek bertahan tepat 30 hari lalu terhapus secara otomatis.

**38. Topik: S3 Lifecycle ke Glacier (Retrieval 6 Jam)**

A company has a financial application that produces reports. The reports average 50 KB in size and are stored in Amazon S3. The reports are frequently accessed during the first week after production and must be stored for several years. The reports must be retrievable within 6 hours. Which solution meets these requirements MOST cost-effectively?

- A. Use S3 Standard. Use an S3 Lifecycle rule to transition the reports to S3 Glacier after 7 days.
- B. Use S3 Standard. Use an S3 Lifecycle rule to transition the reports to S3 Standard-Infrequent Access (S3 Standard-IA) after 7 days.
- C. Use S3 Intelligent-Tiering. Configure S3 Intelligent-Tiering to transition the reports to S3 Standard-Infrequent Access (S3 Standard-IA) and S3 Glacier.
- D. Use S3 Standard. Use an S3 Lifecycle rule to transition the reports to S3 Glacier Deep Archive after 7 days.

**Correct Answer: A**

Karena syarat retrieval maksimal enam jam masih terpenuhi oleh Glacier Flexible Retrieval (bukan Deep Archive yang lebih lambat), Glacier menjadi pilihan paling murah untuk penyimpanan jangka panjang di sini.

**39. Topik: Snowball dengan Tape Gateway**

A company has 5 PB of archived data on physical tapes. The company needs to preserve the data on the tapes for another 10 years for compliance purposes. The company wants to migrate to AWS in the next 6 months. The data center that stores the tapes has a 1 Gbps uplink internet connectivity. Which solution will meet these requirements MOST cost-effectively?

- A. Read the data from the tapes on premises. Stage the data in a local NFS storage. Use AWS DataSync to migrate the data to Amazon S3 Glacier Flexible Retrieval.
- B. Use an on-premises backup application to read the data from the tapes and to write directly to Amazon S3 Glacier Deep Archive.
- C. Order multiple AWS Snowball devices that have Tape Gateway. Copy the physical tapes to virtual tapes in Snowball. Ship the Snowball devices to AWS. Create a lifecycle policy to move the tapes to Amazon S3 Glacier Deep Archive.
- D. Configure an on-premises Tape Gateway. Create virtual tapes in the AWS Cloud. Use backup software to copy the physical tape to the virtual tape.

**Correct Answer: C**

Snowball dengan Tape Gateway memungkinkan konversi tape fisik menjadi virtual tape secara offline, jauh lebih cepat dan murah dibanding transfer 5PB data melalui koneksi 1Gbps.

**40. Topik: S3 Standard-IA untuk Data Jarang Diakses**

A company stores its data objects in Amazon S3 Standard storage. A solutions architect has found that 75% of the data is rarely accessed after 30 days. The company needs all the data to remain immediately accessible with the same high availability and resiliency, but the company wants to minimize storage costs. Which storage solution will meet these requirements?

- A. Move the data objects to S3 Glacier Deep Archive after 30 days.
- B. Move the data objects to S3 Standard-Infrequent Access (S3 Standard-IA) after 30 days.
- C. Move the data objects to S3 One Zone-Infrequent Access (S3 One Zone-IA) after 30 days.
- D. Move the data objects to S3 One Zone-Infrequent Access (S3 One Zone-IA) immediately.

**Correct Answer: B**

Standard-IA tetap menjaga ketersediaan instan dan durabilitas yang setara dengan Standard, namun dengan biaya penyimpanan lebih rendah untuk data yang jarang diakses.

**41. Topik: RDS Encryption at Rest**

A company is migrating its workloads to AWS. The company has transactional and sensitive data in its databases. The company wants to use AWS Cloud solutions to increase security and reduce operational overhead for the databases. Which solution will meet these requirements?

- A. Migrate the databases to Amazon EC2. Use an AWS Key Management Service (AWS KMS) AWS managed key for encryption.
- B. Migrate the databases to Amazon RDS. Configure encryption at rest.
- C. Migrate the data to Amazon S3. Use Amazon Macie for data security and protection.
- D. Migrate the database to Amazon RDS. Use Amazon CloudWatch Logs for data security and protection.

**Correct Answer: B**

Migrasi ke RDS dengan encryption at rest yang diaktifkan memberikan keamanan bagi data sensitif sekaligus mengurangi overhead operasional dibanding mengelola database sendiri di EC2.

**42. Topik: AWS DataSync untuk Sinkronisasi NFS Antar Region**

A company recently created a disaster recovery site in a different AWS Region. The company needs to transfer large amounts of data back and forth between NFS file systems in the two Regions on a periodic basis. Which solution will meet these requirements with the LEAST operational overhead?

- A. Use AWS DataSync.
- B. Use AWS Snowball devices.
- C. Set up an SFTP server on Amazon EC2.
- D. Use AWS Database Migration Service (AWS DMS).

**Correct Answer: A**

DataSync dirancang khusus untuk transfer dan sinkronisasi data NFS secara berkala antar lokasi atau region dengan overhead paling rendah.

**43. Topik: RDS Snapshot Copy Cross-Region untuk DR**

An ecommerce company wants a disaster recovery solution for its Amazon RDS DB instances that run Microsoft SQL Server Enterprise Edition. The company's current recovery point objective (RPO) and recovery time objective (RTO) are 24 hours. Which solution will meet these requirements MOST cost-effectively?

- A. Create a cross-Region read replica and promote the read replica to the primary instance.
- B. Use AWS Database Migration Service (AWS DMS) to create RDS cross-Region replication.
- C. Use cross-Region replication every 24 hours to copy native backups to an Amazon S3 bucket.
- D. Copy automatic snapshots to another Region every 24 hours.

**Correct Answer: D**

Untuk RPO/RTO 24 jam yang relatif longgar, menyalin snapshot otomatis ke region lain setiap 24 jam merupakan solusi paling murah dibanding read replica atau replikasi berkelanjutan.

**44. Topik: Streaming ETL: Kinesis vs MSK+Glue**

A company is preparing a new data platform that will ingest real-time streaming data from multiple sources. The company needs to transform the data before writing the data to Amazon S3. The company needs the ability to use SQL to query the transformed data. Which solutions will meet these requirements? (Choose two.)

- A. Use Amazon Kinesis Data Streams to stream the data. Use Amazon Kinesis Data Analytics to transform the data. Use Amazon Kinesis Data Firehose to write the data to Amazon S3. Use Amazon Athena to query the transformed data from Amazon S3.
- B. Use Amazon Managed Streaming for Apache Kafka (Amazon MSK) to stream the data. Use AWS Glue to transform the data and to write the data to Amazon S3. Use Amazon Athena to query the transformed data from Amazon S3.
- C. Use AWS Database Migration Service (AWS DMS) to ingest the data. Use Amazon EMR to transform the data and to write the data to Amazon S3. Use Amazon Athena to query the transformed data from Amazon S3.
- D. Use Amazon Managed Streaming for Apache Kafka (Amazon MSK) to stream the data. Use Amazon Kinesis Data Analytics to transform the data and to write the data to Amazon S3. Use the Amazon RDS query editor to query the transformed data from Amazon S3.
- E. Use Amazon Kinesis Data Streams to stream the data. Use AWS Glue to transform the data. Use Amazon Kinesis Data Firehose to write the data to Amazon S3. Use the Amazon RDS query editor to query the transformed data from Amazon S3.

**Correct Answer: A, B**

Kedua kombinasi ini sama-sama mampu men-stream, mentransformasi, dan menyimpan data ke S3 sebelum di-query dengan Athena — perbedaannya hanya pada pilihan tool streaming dan transformasinya.

**45. Topik: RDS Read Replica Lintas Region**

An online learning company is migrating to the AWS Cloud. The company maintains its student records in a PostgreSQL database. The company needs a solution in which its data is available and online across multiple AWS Regions at all times. Which solution will meet these requirements with the LEAST amount of operational overhead?

- A. Migrate the PostgreSQL database to a PostgreSQL cluster on Amazon EC2 instances.
- B. Migrate the PostgreSQL database to an Amazon RDS for PostgreSQL DB instance with the Multi-AZ feature turned on.
- C. Migrate the PostgreSQL database to an Amazon RDS for PostgreSQL DB instance. Create a read replica in another Region.
- D. Migrate the PostgreSQL database to an Amazon RDS for PostgreSQL DB instance. Set up DB snapshots to be copied to another Region.

**Correct Answer: C**

Read replica di region lain menyediakan akses data yang tetap online secara global dengan overhead operasional jauh lebih rendah dibanding mengelola cluster PostgreSQL sendiri di EC2.

**46. Topik: KMS untuk Enkripsi RDS**

A company is planning to store data on Amazon RDS DB instances. The company must encrypt the data at rest. What should a solutions architect do to meet this requirement?

- A. Create a key in AWS Key Management Service (AWS KMS). Enable encryption for the DB instances.
- B. Create an encryption key. Store the key in AWS Secrets Manager. Use the key to encrypt the DB instances.
- C. Generate a certificate in AWS Certificate Manager (ACM). Enable SSL/TLS on the DB instances by using the certificate.
- D. Generate a certificate in AWS Identity and Access Management (IAM). Enable SSL/TLS on the DB instances by using the certificate.

**Correct Answer: A**

Mengaktifkan enkripsi RDS secara langsung menggunakan key dari KMS merupakan cara paling langsung dan native untuk memenuhi syarat encryption at rest.

**47. Topik: KMS Customer Managed Key dengan Rotasi Otomatis**

A company is planning to move its data to an Amazon S3 bucket. The data must be encrypted when it is stored in the S3 bucket. Additionally, the encryption key must be automatically rotated every year. Which solution will meet these requirements with the LEAST operational overhead?

- A. Move the data to the S3 bucket. Use server-side encryption with Amazon S3 managed encryption keys (SSE-S3). Use the built-in key rotation behavior of SSE-S3 encryption keys.
- B. Create an AWS Key Management Service (AWS KMS) customer managed key. Enable automatic key rotation. Set the S3 bucket’s default encryption behavior to use the customer managed KMS key. Move the data to the S3 bucket.
- C. Create an AWS Key Management Service (AWS KMS) customer managed key. Set the S3 bucket’s default encryption behavior to use the customer managed KMS key. Move the data to the S3 bucket. Manually rotate the KMS key every year.
- D. Encrypt the data with customer key material before moving the data to the S3 bucket. Create an AWS Key Management Service (AWS KMS) key without key material. Import the customer key material into the KMS key. Enable automatic key rotation.

**Correct Answer: B**

Customer managed key dengan automatic key rotation memenuhi syarat rotasi tahunan tanpa proses manual, berbeda dengan SSE-S3 yang periode rotasinya tidak dapat dikustomisasi.

**48. Topik: EBS Encrypted Volumes**

A company is deploying a new application on Amazon EC2 instances. The application writes data to Amazon Elastic Block Store (Amazon EBS) volumes. The company needs to ensure that all data that is written to the EBS volumes is encrypted at rest. Which solution will meet this requirement?

- A. Create an IAM role that specifies EBS encryption. Attach the role to the EC2 instances.
- B. Create the EBS volumes as encrypted volumes. Attach the EBS volumes to the EC2 instances.
- C. Create an EC2 instance tag that has a key of Encrypt and a value of True. Tag all instances that require encryption at the EBS level.
- D. Create an AWS Key Management Service (AWS KMS) key policy that enforces EBS encryption in the account. Ensure that the key policy is active.

**Correct Answer: B**

Membuat volume EBS langsung sebagai encrypted volume merupakan cara paling sederhana dan pasti untuk menjamin seluruh data yang ditulis ke volume tersebut terenkripsi.

**49. Topik: Secrets Manager Multi-Region + Rotasi Terjadwal**

A company performs monthly maintenance on its AWS infrastructure. During these maintenance activities, the company needs to rotate the credentials for its Amazon RDS for MySQL databases across multiple AWS Regions. Which solution will meet these requirements with the LEAST operational overhead?

- A. Store the credentials as secrets in AWS Secrets Manager. Use multi-Region secret replication for the required Regions. Configure Secrets Manager to rotate the secrets on a schedule.
- B. Store the credentials as secrets in AWS Systems Manager by creating a secure string parameter. Use multi-Region secret replication for the required Regions. Configure Systems Manager to rotate the secrets on a schedule.
- C. Store the credentials in an Amazon S3 bucket that has server-side encryption (SSE) enabled. Use Amazon EventBridge (Amazon CloudWatch Events) to invoke an AWS Lambda function to rotate the credentials.
- D. Encrypt the credentials as secrets by using AWS Key Management Service (AWS KMS) multi-Region customer managed keys. Store the secrets in an Amazon DynamoDB global table. Use an AWS Lambda function to retrieve the secrets from DynamoDB. Use the RDS API to rotate the secrets.

**Correct Answer: A**

Secrets Manager mendukung replikasi rahasia lintas region sekaligus rotasi terjadwal otomatis, memenuhi kebutuhan rotasi kredensial multi-region tanpa proses manual.

**50. Topik: Gateway VPC Endpoint untuk S3**

An application that is hosted on Amazon EC2 instances needs to access an Amazon S3 bucket. Traffic must not traverse the internet. How should a solutions architect configure access to meet these requirements?

- A. Create a private hosted zone by using Amazon Route 53.
- B. Set up a gateway VPC endpoint for Amazon S3 in the VPC.
- C. Configure the EC2 instances to use a NAT gateway to access the S3 bucket.
- D. Establish an AWS Site-to-Site VPN connection between the VPC and the S3 bucket.

**Correct Answer: B**

Gateway VPC endpoint memungkinkan traffic dari EC2 menuju S3 tetap berada di jaringan AWS tanpa pernah melewati internet publik.

**51. Topik: Transit Gateway untuk Ratusan VPC**

A company needs to connect several VPCs in the us-east-1 Region that span hundreds of AWS accounts. The company's networking team has its own AWS account to manage the cloud network. What is the MOST operationally efficient solution to connect the VPCs?

- A. Set up VPC peering connections between each VPC. Update each associated subnet’s route table
- B. Configure a NAT gateway and an internet gateway in each VPC to connect each VPC through the internet
- C. Create an AWS Transit Gateway in the networking team’s AWS account. Configure static routes from each VPC.
- D. Deploy VPN gateways in each VPC. Create a transit VPC in the networking team’s AWS account to connect to each VPC.

**Correct Answer: C**

Untuk menghubungkan ratusan VPC lintas banyak akun, Transit Gateway sebagai hub pusat jauh lebih efisien secara operasional dibanding peering satu per satu atau VPN per VPC.

**52. Topik: VPC Endpoint untuk Akses S3 Privat**

A company has an application that runs on Amazon EC2 instances in a private subnet. The application needs to process sensitive information from an Amazon S3 bucket. The application must not use the internet to connect to the S3 bucket. Which solution will meet these requirements?

- A. Configure an internet gateway. Update the S3 bucket policy to allow access from the internet gateway. Update the application to use the new internet gateway.
- B. Configure a VPN connection. Update the S3 bucket policy to allow access from the VPN connection. Update the application to use the new VPN connection.
- C. Configure a NAT gateway. Update the S3 bucket policy to allow access from the NAT gateway. Update the application to use the new NAT gateway.
- D. Configure a VPC endpoint. Update the S3 bucket policy to allow access from the VPC endpoint. Update the application to use the new VPC endpoint.

**Correct Answer: D**

VPC endpoint memberikan jalur privat menuju S3 tanpa melibatkan internet gateway, NAT gateway, maupun VPN sama sekali.

**53. Topik: NAT Gateway di Public Subnet**

An Amazon EC2 instance is located in a private subnet in a new VPC. This subnet does not have outbound internet access, but the EC2 instance needs the ability to download monthly security updates from an outside vendor. What should a solutions architect do to meet these requirements?

- A. Create an internet gateway, and attach it to the VPC. Configure the private subnet route table to use the internet gateway as the default route.
- B. Create a NAT gateway, and place it in a public subnet. Configure the private subnet route table to use the NAT gateway as the default route.
- C. Create a NAT instance, and place it in the same subnet where the EC2 instance is located. Configure the private subnet route table to use the NAT instance as the default route.
- D. Create an internet gateway, and attach it to the VPC. Create a NAT instance, and place it in the same subnet where the EC2 instance is located. Configure the private subnet route table to use the internet gateway as the default route.

**Correct Answer: B**

NAT Gateway harus ditempatkan di public subnet — bukan di private subnet tempat instance berada — agar instance di private subnet dapat mengakses internet secara outbound-only.

**54. Topik: Keamanan Root User: Password Kuat + MFA**

A solutions architect has created a new AWS account and must secure AWS account root user access. Which combination of actions will accomplish this? (Choose two.)

- A. Ensure the root user uses a strong password.
- B. Enable multi-factor authentication to the root user.
- C. Store root user access keys in an encrypted Amazon S3 bucket.
- D. Add the root user to a group containing administrative permissions.
- E. Apply the required permissions to the root user with an inline policy document.

**Correct Answer: A, B**

Password yang kuat dan MFA merupakan dua langkah dasar dan wajib untuk mengamankan root user — menyimpan access key atau memberi permission tambahan pada root justru bertentangan dengan best practice.

**55. Topik: IAM Role untuk Akses Lambda ke S3**

A company has an AWS Lambda function that needs read access to an Amazon S3 bucket that is located in the same AWS account. Which solution will meet these requirements in the MOST secure manner?

- A. Apply an S3 bucket policy that grants read access to the S3 bucket.
- B. Apply an IAM role to the Lambda function. Apply an IAM policy to the role to grant read access to the S3 bucket.
- C. Embed an access key and a secret key in the Lambda function’s code to grant the required IAM permissions for read access to the S3 bucket.
- D. Apply an IAM role to the Lambda function. Apply an IAM policy to the role to grant read access to all S3 buckets in the account.

**Correct Answer: B**

IAM role memberikan kredensial sementara dengan izin yang dibatasi hanya pada bucket yang dibutuhkan, jauh lebih aman dibanding bucket policy terbuka atau access key yang di-hardcode.

**56. Topik: IAM Role sebagai Execution Role Lambda**

A serverless application uses Amazon API Gateway, AWS Lambda, and Amazon DynamoDB. The Lambda function needs permissions to read and write to the DynamoDB table. Which solution will give the Lambda function access to the DynamoDB table MOST securely?

- A. Create an IAM user with programmatic access to the Lambda function. Attach a policy to the user that allows read and write access to the DynamoDB table. Store the access_key_id and secret_access_key parameters as part of the Lambda environment variables. Ensure that other AWS users do not have read and write access to the Lambda function configuration.
- B. Create an IAM role that includes Lambda as a trusted service. Attach a policy to the role that allows read and write access to the DynamoDB table. Update the configuration of the Lambda function to use the new role as the execution role.
- C. Create an IAM user with programmatic access to the Lambda function. Attach a policy to the user that allows read and write access to the DynamoDB table. Store the access_key_id and secret_access_key parameters in AWS Systems Manager Parameter Store as secure string parameters. Update the Lambda function code to retrieve the secure string parameters before connecting to the DynamoDB table.
- D. Create an IAM role that includes DynamoDB as a trusted service. Attach a policy to the role that allows read and write access from the Lambda function. Update the code of the Lambda function to attach to the new role as an execution role.

**Correct Answer: B**

IAM role dengan Lambda sebagai trusted service menerapkan prinsip least privilege tanpa memerlukan access key statis sama sekali — pola ini serupa dengan pertanyaan sebelumnya mengenai akses Lambda ke S3.

**57. Topik: IAM Role + VPC Endpoint untuk EKS ke DynamoDB**

A company has deployed a Java Spring Boot application as a pod that runs on Amazon Elastic Kubernetes Service (Amazon EKS) in private subnets. The application needs to write data to an Amazon DynamoDB table. A solutions architect must ensure that the application can interact with the DynamoDB table without exposing traffic to the internet. Which combination of steps should the solutions architect take to accomplish this goal? (Choose two.)

- A. Attach an IAM role that has sufficient privileges to the EKS pod.
- B. Attach an IAM user that has sufficient privileges to the EKS pod.
- C. Allow outbound connectivity to the DynamoDB table through the private subnets’ network ACLs.
- D. Create a VPC endpoint for DynamoDB.
- E. Embed the access keys in the Java Spring Boot code.

**Correct Answer: A, D**

Kombinasi IAM role (bukan IAM user atau access key) untuk pod EKS dan VPC endpoint untuk DynamoDB memastikan akses yang aman tanpa kredensial statis maupun traffic menuju internet publik.

**58. Topik: Pola Fan-Out: SNS ke SQS**

A company has an automobile sales website that stores its listings in a database on Amazon RDS. When an automobile is sold, the listing needs to be removed from the website and the data must be sent to multiple target systems. Which design should a solutions architect recommend?

- A. Create an AWS Lambda function triggered when the database on Amazon RDS is updated to send the information to an Amazon Simple Queue Service (Amazon SQS) queue for the targets to consume.
- B. Create an AWS Lambda function triggered when the database on Amazon RDS is updated to send the information to an Amazon Simple Queue Service (Amazon SQS) FIFO queue for the targets to consume.
- C. Subscribe to an RDS event notification and send an Amazon Simple Queue Service (Amazon SQS) queue fanned out to multiple Amazon Simple Notification Service (Amazon SNS) topics. Use AWS Lambda functions to update the targets.
- D. Subscribe to an RDS event notification and send an Amazon Simple Notification Service (Amazon SNS) topic fanned out to multiple Amazon Simple Queue Service (Amazon SQS) queues. Use AWS Lambda functions to update the targets.

**Correct Answer: D**

Pola fan-out standar pada AWS adalah SNS menuju banyak SQS queue (satu event, banyak consumer independen) — bukan sebaliknya.

**59. Topik: SNS FIFO untuk Multi-Subscriber Terurut**

A company is building a game system that needs to send unique events to separate leaderboard, matchmaking, and authentication services concurrently. The company needs an AWS event-driven system that guarantees the order of the events. Which solution will meet these requirements?

- A. Amazon EventBridge event bus
- B. Amazon Simple Notification Service (Amazon SNS) FIFO topics
- C. Amazon Simple Notification Service (Amazon SNS) standard topics
- D. Amazon Simple Queue Service (Amazon SQS) FIFO queues

**Correct Answer: B**

SNS FIFO topic mampu mengirimkan event ke banyak subscriber secara bersamaan sekaligus menjaga urutan pengiriman — SQS FIFO hanya sesuai untuk satu consumer per antrean.

**60. Topik: S3 Replication + EventBridge untuk Pipeline Otomatis**

A reporting team receives files each day in an Amazon S3 bucket. The reporting team manually reviews and copies the files from this initial S3 bucket to an analysis S3 bucket each day at the same time to use with Amazon QuickSight. Additional teams are starting to send more files in larger sizes to the initial S3 bucket. The reporting team wants to move the files automatically analysis S3 bucket as the files enter the initial S3 bucket. The reporting team also wants to use AWS Lambda functions to run pattern-matching code on the copied data. In addition, the reporting team wants to send the data files to a pipeline in Amazon SageMaker Pipelines. What should a solutions architect do to meet these requirements with the LEAST operational overhead?

- A. Create a Lambda function to copy the files to the analysis S3 bucket. Create an S3 event notification for the analysis S3 bucket. Configure Lambda and SageMaker Pipelines as destinations of the event notification. Configure s3:ObjectCreated:Put as the event type.
- B. Create a Lambda function to copy the files to the analysis S3 bucket. Configure the analysis S3 bucket to send event notifications to Amazon EventBridge (Amazon CloudWatch Events). Configure an ObjectCreated rule in EventBridge (CloudWatch Events). Configure Lambda and SageMaker Pipelines as targets for the rule.
- C. Configure S3 replication between the S3 buckets. Create an S3 event notification for the analysis S3 bucket. Configure Lambda and SageMaker Pipelines as destinations of the event notification. Configure s3:ObjectCreated:Put as the event type.
- D. Configure S3 replication between the S3 buckets. Configure the analysis S3 bucket to send event notifications to Amazon EventBridge (Amazon CloudWatch Events). Configure an ObjectCreated rule in EventBridge (CloudWatch Events). Configure Lambda and SageMaker Pipelines as targets for the rule.

**Correct Answer: D**

S3 Replication menghilangkan kebutuhan akan fungsi Lambda custom untuk menyalin file, dan EventBridge — bukan S3 event notification biasa — diperlukan karena target yang dituju lebih dari satu layanan sekaligus.

**61. Topik: Snowball karena Bandwidth Tidak Mencukupi**

A company must migrate 20 TB of data from a data center to the AWS Cloud within 30 days. The company’s network bandwidth is limited to 15 Mbps and cannot exceed 70% utilization. What should a solutions architect do to meet these requirements?

- A. Use AWS Snowball.
- B. Use AWS DataSync.
- C. Use a secure VPN connection.
- D. Use Amazon S3 Transfer Acceleration.

**Correct Answer: A**

Setelah dihitung, bandwidth 15 Mbps pada utilisasi 70% jelas tidak mencukupi untuk mentransfer 20TB data dalam 30 hari secara online, sehingga transfer fisik melalui Snowball menjadi satu-satunya solusi yang realistis.

**62. Topik: Snowball untuk Migrasi Skala Petabyte**

A company will migrate 10 PB of data to Amazon S3 in 6 weeks. The current data center has a 500 Mbps uplink to the internet. Other on-premises applications share the uplink. The company can use 80% of the internet bandwidth for this one-time migration task. Which solution will meet these requirements?

- A. Configure AWS DataSync to migrate the data to Amazon S3 and to automatically verify the data.
- B. Use rsync to transfer the data directly to Amazon S3.
- C. Use the AWS CLI and multiple copy processes to send the data directly to Amazon S3.
- D. Order multiple AWS Snowball devices. Copy the data to the devices. Send the devices to AWS to copy the data to Amazon S3.

**Correct Answer: D**

Dengan uplink yang hanya 500 Mbps dan dipakai bersama aplikasi lain, mentransfer 10PB data secara online dalam waktu enam minggu tidak realistis — Snowball merupakan pilihan yang tepat.

**63. Topik: Snowball Edge untuk Data Sensitif Berskala Besar**

A company needs to transfer 600 TB of data from its on-premises network-attached storage (NAS) system to the AWS Cloud. The data transfer must be complete within 2 weeks. The data is sensitive and must be encrypted in transit. The company’s internet connection can support an upload speed of 100 Mbps. Which solution meets these requirements MOST cost-effectively?

- A. Use Amazon S3 multi-part upload functionality to transfer the files over HTTPS.
- B. Create a VPN connection between the on-premises NAS system and the nearest AWS Region. Transfer the data over the VPN connection.
- C. Use the AWS Snow Family console to order several AWS Snowball Edge Storage Optimized devices. Use the devices to transfer the data to Amazon S3.
- D. Set up a 10 Gbps AWS Direct Connect connection between the company location and the nearest AWS Region. Transfer the data over a VPN connection into the Region to store the data in Amazon S3.

**Correct Answer: C**

Transfer 600TB data melalui koneksi 100 Mbps akan memakan waktu jauh lebih lama dari dua minggu, sehingga Snowball Edge — yang turut mendukung enkripsi — menjadi solusi paling hemat biaya.

**64. Topik: DataSync untuk Migrasi Data Online Terenkripsi**

A company wants to migrate 100 GB of historical data from an on-premises location to an Amazon S3 bucket. The company has a 100 megabits per second (Mbps) internet connection on premises. The company needs to encrypt the data in transit to the S3 bucket. The company will store new data directly in Amazon S3. Which solution will meet these requirements with the LEAST operational overhead?

- A. Use the s3 sync command in the AWS CLI to move the data directly to an S3 bucket
- B. Use AWS DataSync to migrate the data from the on-premises location to an S3 bucket
- C. Use AWS Snowball to move the data to an S3 bucket
- D. Set up an IPsec VPN from the on-premises location to AWS. Use the s3 cp command in the AWS CLI to move the data directly to an S3 bucket

**Correct Answer: B**

Untuk volume data yang relatif kecil (100GB) dengan bandwidth 100 Mbps yang masih memadai, DataSync sudah cukup untuk migrasi online yang aman dan efisien tanpa perlu transfer fisik.

**65. Topik: Snowball + Glacier Deep Archive untuk Arsip Tujuh Tahun**

A company has 700 TB of backup data stored in network attached storage (NAS) in its data center. This backup data need to be accessible for infrequent regulatory requests and must be retained 7 years. The company has decided to migrate this backup data from its data center to AWS. The migration must be complete within 1 month. The company has 500 Mbps of dedicated bandwidth on its public internet connection available for data transfer. What should a solutions architect do to migrate and store the data at the LOWEST cost?

- A. Order AWS Snowball devices to transfer the data. Use a lifecycle policy to transition the files to Amazon S3 Glacier Deep Archive.
- B. Deploy a VPN connection between the data center and Amazon VPC. Use the AWS CLI to copy the data from on premises to Amazon S3 Glacier.
- C. Provision a 500 Mbps AWS Direct Connect connection and transfer the data to Amazon S3. Use a lifecycle policy to transition the files to Amazon S3 Glacier Deep Archive.
- D. Use AWS DataSync to transfer the data and deploy a DataSync agent on premises. Use the DataSync task to copy files from the on-premises NAS storage to Amazon S3 Glacier.

**Correct Answer: A**

Snowball menangani transfer fisik data berskala besar secara cepat, dan Glacier Deep Archive merupakan kelas penyimpanan termurah yang sesuai untuk data arsip yang jarang diakses namun harus disimpan selama bertahun-tahun.

---

## Penutup

Materi ini tidak sempurna dan bukan pengganti pembelajaran mendalam, tapi semoga membantu Anda mengenali pola soal yang sering menjadi jebakan.

Semoga sukses untuk ujian Anda.
