import { PlotExons } from './PlotExons';

export class PlotFusionExons extends PlotExons {
  constructor(transcript, ...args) {
    super(...args);
    this.transcript = transcript;
    this.draw();
  }

  drawFusionJunction(junctionLocation) {
    var junctionLocationNorm = (junctionLocation / this.normalize) * 0.9;

    this.lines.push({
      x0: this.offset + junctionLocationNorm,
      x1: this.offset + junctionLocationNorm,
      y0: 0.15+this.verticalOffset,
      y1: 0.2+this.verticalOffset,
      color: 'black'
    });
    this.texts.push({
      x: this.offset + junctionLocationNorm,
      y: 0.05 + this.verticalOffset,
      text: junctionLocation/1000
    });
  }

  drawExons() {
    var index = 0;
    for (var i = 0; i < this.transcript.cdnaIntervalsGene1.length; i++) {

      var exon = this.transcript.cdnaIntervalsGene1[i];
      var start = null;
      var end = null;

      if (this.transcript.transcript1.strand == '+') {
        start = exon[0] - this.transcript.transcript1.start;
        end = exon[1] - this.transcript.transcript1.start;
      } else {

        // this is so the transcription direction is not plotted
        // in reverse for genes on minus strand

        start = -(exon[1] - this.transcript.transcript1.end);
        end = -(exon[0] - this.transcript.transcript1.end);
      }

      var exonStart = (start / this.normalize) * 0.9 + this.offset;
      var exonEnd = (end / this.normalize) * 0.9 + this.offset;
      var exonCenter = (exonEnd - exonStart) / 2. + exonStart;

      this.rects.push({
        x: exonStart,
        y: 0.45,
        width: exonEnd-exonStart,
        height: 0.1,
        color: "black",
        index: i
      });

      index++;
    }

    var distanceToAdd = null;

    if (this.transcript.transcript1.strand == '+') {
      distanceToAdd = this.transcript.gene1Junction - this.transcript.transcript1.start;
    } else {
      distanceToAdd = this.transcript.transcript1.end - this.transcript.gene1Junction;
    }

    for (var i = 0; i < this.transcript.cdnaIntervalsGene2.length; i++) {
      var exon = this.transcript.cdnaIntervalsGene2[i];
      var start = null;
      var end = null;

      if (this.transcript.transcript2.strand == '+') {
        start = exon[0] - this.transcript.gene2Junction;
        end = exon[1] - this.transcript.gene2Junction;
      } else {

        // this is so the transcription direction is not plotted
        // in reverse for genes on minus strand

        start = this.transcript.gene2Junction - exon[1];
        end = this.transcript.gene2Junction - exon[0];
      }

      start = start + distanceToAdd;
      end = end + distanceToAdd;

      var exonStart = ((start / this.normalize) * 0.9) + this.offset;
      var exonEnd = ((end / this.normalize) * 0.9) + this.offset;
      var exonCenter = ((exonEnd - exonStart) / 2) + exonStart;

      this.rects.push({
        x: exonStart,
        y: 0.45,
        width: exonEnd-exonStart,
        height: 0.1,
        color: "red",
        index: index
      });

      index++;
    }
  }

  drawMainBody(nameSymbols, nameIsoform, length) {
    // main protein frame

    if (this.transcript.transcript1.strand == '+') {
      var gene1Length = ((this.transcript.gene1Junction - this.transcript.transcript1.start) / this.normalize) * 0.9;
    } else {
      var gene1Length = ((this.transcript.transcript1.end - this.transcript.gene1Junction) / this.normalize) * 0.9;
    }

    if (this.transcript.transcript2.strand == '+') {
      var gene2Length = ((this.transcript.transcript2.end - this.transcript.gene2Junction) / this.normalize) * 0.9;
    } else {
      var gene2Length = ((this.transcript.gene2Junction - this.transcript.transcript2.start) / this.normalize) * 0.9;
    }

    this.body.push({
      type: 'line',
      x0: this.offset,
      x1: this.offset + gene1Length,
      y0: 0.5,
      y1: 0.5,
      color: 'black'
    });

    this.body.push({
      type: 'line',
      x0: this.offset + gene1Length,
      x1: this.offset + gene1Length + gene2Length,
      y0: 0.5,
      y1: 0.5,
      color: 'red'
    });

    // this.texts.push({
    //   x: 0.5,
    //   y: 0.9,
    //   text: nameSymbols
    // });
    // this.texts.push({
    //   x: 0.5,
    //   y: 0.83,
    //   text: nameIsoform,
    // });
  }

  draw() {

    if (this.transcript.transcript1.strand == '+') {
      var gene1Length = this.transcript.gene1Junction - this.transcript.transcript1.start;
    } else {
      var gene1Length = this.transcript.transcript1.end - this.transcript.gene1Junction;
    }

    if (this.transcript.transcript2.strand == '+') {
      var gene2Length = this.transcript.transcript2.end - this.transcript.gene2Junction;
    } else {
      var gene2Length = this.transcript.gene2Junction - this.transcript.transcript2.start;
    }

    this.scaleSequence(gene1Length + gene2Length)
    this.drawExons()
    this.drawLengthMarkers(gene1Length+gene2Length)
    this.drawFusionJunction(gene1Length)
    this.drawMainBody(
        this.transcript.transcript1.name + ' : ' + this.transcript.transcript2.name,
        this.transcript.transcript1.id + ' : ' + this.transcript.transcript2.id,
        gene1Length+gene2Length
    );
  }
}